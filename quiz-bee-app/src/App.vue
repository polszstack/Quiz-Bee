<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-4 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <!-- Left: Logo and Title -->
          <div class="flex items-center gap-2 sm:gap-3">
            <img src="/icons/bee.png" alt="Quiz Bee" class="w-8 h-8 sm:w-10 sm:h-10" />
            <div>
              <h1 class="text-lg sm:text-xl font-bold text-gray-900">Quiz Bee</h1>
              <p class="text-xs text-gray-500 hidden sm:block">Test your knowledge</p>
            </div>
          </div>

          <!-- Right: Developer Profile -->
          <DeveloperProfile />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <!-- Registration Screen -->
      <div v-if="gameState === 'registration'" class="flex justify-center">
        <RegistrationForm 
          :categories="categories"
          :categoriesLoading="categoriesLoading"
          @register="handleRegister"
          @loadCategories="loadCategories"
        />
      </div>

      <!-- Start Screen -->
      <div v-else-if="gameState === 'start'" class="max-w-lg mx-auto">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <img src="/icons/bee.png" alt="Quiz Bee" class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6" />
          <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            Welcome, {{ playerInfo.name }}!
          </h2>
          <p class="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">Ready to test your knowledge?</p>
          
          <!-- Quiz Info -->
          <div class="bg-gray-50 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 space-y-2 sm:space-y-3">
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-gray-500">Category</span>
              <span class="text-gray-900 font-medium">{{ getCategoryName(playerInfo.category) }}</span>
            </div>
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-gray-500">Difficulty</span>
              <span class="text-gray-900 font-medium capitalize">{{ playerInfo.difficulty === 'any' ? 'Any' : playerInfo.difficulty }}</span>
            </div>
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-gray-500">Questions</span>
              <span class="text-gray-900 font-medium">10</span>
            </div>
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-gray-500">Time per Question</span>
              <span class="text-gray-900 font-medium">{{ timerSettings.questionTime }}s</span>
            </div>
            <div v-if="timerSettings.totalTime > 0" class="flex justify-between text-xs sm:text-sm">
              <span class="text-gray-500">Total Time</span>
              <span class="text-gray-900 font-medium">{{ formatTotalTime(timerSettings.totalTime) }}</span>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
            <span class="text-amber-500 text-base sm:text-lg">🔒</span>
            <p class="text-amber-700 text-xs sm:text-sm text-left">
              Anti-cheat protection enabled. Please don't switch tabs.
            </p>
          </div>
          
          <button 
            @click="startGame" 
            :disabled="loading"
            class="w-full bg-indigo-600 text-white font-medium py-2.5 sm:py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2 sm:mb-3 text-sm sm:text-base"
          >
            <span v-if="loading">Loading...</span>
            <span v-else>Start Quiz</span>
          </button>
          
          <button 
            @click="resetGame"
            class="w-full text-gray-500 py-2 px-4 rounded-xl hover:bg-gray-100 transition-colors text-xs sm:text-sm"
          >
            ← Change Settings
          </button>
          
          <p v-if="error" class="mt-4 text-red-600 text-xs sm:text-sm">{{ error }}</p>
        </div>
      </div>

      <!-- Quiz Screen -->
      <div v-else-if="gameState === 'playing' || gameState === 'answered' || gameState === 'timeout'" class="max-w-2xl mx-auto space-y-3 sm:space-y-4">
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
          class="bg-amber-50 border border-amber-200 rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2 text-amber-700 text-xs sm:text-sm"
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

        <div v-if="gameState === 'timeout'" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <div class="text-3xl sm:text-4xl mb-2 sm:mb-3">⏰</div>
          <p class="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Time's up!</p>
          <p v-if="currentQuestion" class="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
            Correct answer: <strong class="text-green-600">{{ getCorrectAnswer() }}</strong>
          </p>
          <button @click="nextQuestion" class="w-full bg-indigo-600 text-white font-medium py-2.5 sm:py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors text-sm sm:text-base">
            {{ currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results' }}
          </button>
        </div>

        <div v-if="gameState === 'answered'" class="text-center">
          <button @click="nextQuestion" class="bg-indigo-600 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl hover:bg-indigo-700 transition-colors text-sm sm:text-base">
            {{ currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results' }}
          </button>
        </div>
      </div>

      <!-- Game Over Screen -->
      <div v-else-if="gameState === 'gameover'" class="max-w-lg mx-auto">
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
import DeveloperProfile from './components/DeveloperProfile.vue'
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