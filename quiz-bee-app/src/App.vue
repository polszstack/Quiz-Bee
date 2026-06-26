<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Header -->
    <header class="pt-12 pb-8 px-4 text-center">
      <div class="flex justify-center mb-4">
        <img 
          src="/icons/bee.png" 
          alt="Quiz Bee" 
          class="w-16 h-16 object-contain"
        />
      </div>
      <h1 class="text-5xl font-bold text-white mb-2 tracking-tight">
        Quiz Bee
      </h1>
      <p class="text-lg text-purple-200/80">
        Test your knowledge with fun quizzes
      </p>
    </header>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-4 pb-12">
      <!-- Registration Screen -->
      <div v-if="gameState === 'registration'" class="flex justify-center items-center min-h-[60vh]">
        <RegistrationForm 
          :categories="categories"
          :categoriesLoading="categoriesLoading"
          @register="handleRegister"
          @loadCategories="loadCategories"
        />
      </div>

      <!-- Start Screen -->
      <div v-else-if="gameState === 'start'" class="flex justify-center items-center min-h-[60vh]">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20 shadow-2xl">
          <div class="mb-6 flex justify-center">
            <img 
              src="/icons/bee.png" 
              alt="Quiz Bee" 
              class="w-24 h-24 object-contain"
            />
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">
            Welcome, {{ playerInfo.name }}!
          </h2>
          
          <!-- Quiz Info -->
          <div class="bg-white/5 rounded-xl p-5 mb-6 text-left space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-purple-200/70">Category</span>
              <span class="text-white font-medium">{{ getCategoryName(playerInfo.category) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-purple-200/70">Difficulty</span>
              <span class="text-white font-medium capitalize">{{ playerInfo.difficulty === 'any' ? 'Any' : playerInfo.difficulty }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-purple-200/70">Questions</span>
              <span class="text-white font-medium">10</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-purple-200/70">Time per Question</span>
              <span class="text-white font-medium">{{ timerSettings.questionTime }}s</span>
            </div>
            <div v-if="timerSettings.totalTime > 0" class="flex justify-between items-center text-sm">
              <span class="text-purple-200/70">Total Time</span>
              <span class="text-white font-medium">{{ formatTotalTime(timerSettings.totalTime) }}</span>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span class="text-amber-400 text-xl flex-shrink-0">🔒</span>
            <p class="text-amber-300/90 text-sm text-left">
              Anti-cheat protection enabled. Please don't switch tabs or copy questions.
            </p>
          </div>
          
          <button 
            @click="startGame" 
            :disabled="loading"
            class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            <span v-if="loading">Loading Questions...</span>
            <span v-else>Start Quiz 🚀</span>
          </button>
          
          <button 
            @click="resetGame"
            class="w-full bg-white/5 text-purple-200/70 py-2 px-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-sm"
          >
            ← Change Settings
          </button>
          
          <p v-if="error" class="mt-4 text-red-400 text-sm">{{ error }}</p>
        </div>
      </div>

      <!-- Quiz Screen -->
      <div v-else-if="gameState === 'playing' || gameState === 'answered' || gameState === 'timeout'" class="space-y-4">
        <ScoreBoard 
          :score="score" 
          :total="questions.length" 
          :currentQuestion="currentQuestionIndex + 1"
          :progress="progress"
          :playerName="playerInfo.name"
        />
        
        <QuizTimer
          :timeLeft="questionTimeLeft"
          :totalTimeLeft="totalTimeLeft"
          :totalTime="timerSettings.totalTime"
          :timerWarning="timerWarning"
          :timePercentage="questionTimePercentage"
        />
        
        <SecurityWarning
          :show="showWarning"
          :message="warningMessage"
          :tabSwitchCount="tabSwitchCount"
          @dismiss="showWarning = false"
        />
        
        <div 
          v-if="tabSwitchCount > 0 && gameState === 'playing'"
          class="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 flex items-center gap-2 text-amber-300 text-sm"
        >
          <span>⚠️</span>
          <span>Tab switches detected: {{ tabSwitchCount }}</span>
        </div>
        
        <QuestionCard 
          v-if="currentQuestion"
          :question="currentQuestion"
          :selectedAnswer="selectedAnswer"
          :isCorrect="isCorrect"
          :gameState="gameState"
          :questionChanged="questionChanged"
          @answer="submitAnswer"
        />

        <!-- Timeout Message -->
        <div v-if="gameState === 'timeout'" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <div class="text-5xl mb-4">⏰</div>
          <p class="text-2xl font-bold text-red-400 mb-3">Time's up!</p>
          <p v-if="currentQuestion" class="text-purple-200/70 mb-6">
            The correct answer was: <strong class="text-green-400">{{ getCorrectAnswer() }}</strong>
          </p>
          <button @click="nextQuestion" class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
            {{ currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results 🏆' }}
          </button>
        </div>

        <!-- Next Button -->
        <div v-if="gameState === 'answered'" class="text-center">
          <button @click="nextQuestion" class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-8 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200">
            {{ currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results 🏆' }}
          </button>
        </div>
      </div>

      <!-- Game Over Screen -->
      <div v-else-if="gameState === 'gameover'" class="flex justify-center items-center min-h-[60vh]">
        <GameOver 
          :score="score" 
          :total="questions.length"
          :playerName="playerInfo.name"
          :category="getCategoryName(playerInfo.category)"
          :difficulty="playerInfo.difficulty"
          :tabSwitchCount="tabSwitchCount"
          @restart="resetGame"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useQuiz } from './composables/useQuiz'
import RegistrationForm from './components/RegistrationForm.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import QuestionCard from './components/QuestionCard.vue'
import QuizTimer from './components/QuizTimer.vue'
import SecurityWarning from './components/SecurityWarning.vue'
import GameOver from './components/GameOver.vue'
import type { Difficulty } from './types/quiz'

const {
  playerInfo,
  questions,
  currentQuestion,
  currentQuestionIndex,
  score,
  gameState,
  selectedAnswer,
  isCorrect,
  loading,
  error,
  progress,
  categories,
  categoriesLoading,
  questionTimeLeft,
  totalTimeLeft,
  timerSettings,
  timerWarning,
  questionTimePercentage,
  showWarning,
  warningMessage,
  tabSwitchCount,
  questionChanged,
  loadCategories,
  registerPlayer,
  startGame,
  submitAnswer,
  nextQuestion,
  resetGame
} = useQuiz()

function handleRegister(name: string, category: number, difficulty: Difficulty, settings: { questionTime: number; totalTime: number }) {
  registerPlayer(name, category, difficulty, settings)
}

function getCategoryName(categoryId: number): string {
  if (categoryId === 0) return 'Any Category'
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : 'Unknown'
}

function formatTotalTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  if (minutes === 1) return '1 minute'
  return `${minutes} minutes`
}

function getCorrectAnswer(): string {
  if (!currentQuestion.value) return ''
  return currentQuestion.value.correctAnswer
    .replace(/\s*\(verify source\)/gi, '')
    .replace(/\s*\[citation needed\]/gi, '')
    .replace(/\s*-\s*multiple sources/gi, '')
    .replace(/\s*\(check references\)/gi, '')
    .replace(/\s*\[cross-reference required\]/gi, '')
    .replace(/\s*\{see documentation\}/gi, '')
    .replace(/\s*<<confirm>>/gi, '')
    .replace(/\s*\|\|validate\|\|/gi, '')
    .trim()
}

watch(gameState, (newState) => {
  if (newState === 'playing') {
    document.body.style.userSelect = 'none'
  } else if (newState === 'gameover' || newState === 'registration') {
    document.body.style.userSelect = ''
  }
})
</script>