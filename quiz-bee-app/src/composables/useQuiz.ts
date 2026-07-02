import { ref, computed, onUnmounted } from 'vue';
import type {
  QuestionWithAnswers,
  GameState,
  PlayerInfo,
  QuizCategory,
  Difficulty,
  TimerSettings
} from '../types/quiz';
import { fetchQuestions, fetchCategories } from '../services/api';
import { useAntiCheat } from './useAntiCheat'; // ✅ ADD THIS IMPORT

export function useQuiz() {
  const playerInfo = ref<PlayerInfo>({
    name: '',
    category: 0,
    difficulty: 'any'
  });

  const questions = ref<QuestionWithAnswers[]>([]);
  const currentQuestionIndex = ref(0);
  const score = ref(0);
  const gameState = ref<GameState>('registration');
  const selectedAnswer = ref<string | null>(null);
  const isCorrect = ref<boolean | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const categories = ref<QuizCategory[]>([]);
  const categoriesLoading = ref(false);

  // ✅ USE ACTUAL ANTI-CHEAT INSTEAD OF PLACEHOLDERS
  const antiCheat = useAntiCheat();

  // Timer related refs
  const questionTimeLeft = ref(25); // ✅ Changed to 25
  const totalTimeLeft = ref(0);

  const timerSettings = ref<TimerSettings>({
    questionTime: 25, // ✅ Changed to 25
    totalTime: 0
  });

  let questionTimerInterval: number | null = null;

  const timerWarning = ref(false);

  const currentQuestion = computed(() => {
    // ✅ Use anti-cheat display question
    const displayQuestion = antiCheat.getDisplayQuestion();
    if (displayQuestion) return displayQuestion;
    return questions.value[currentQuestionIndex.value] || null;
  });

  const progress = computed(() =>
    questions.value.length > 0
      ? ((currentQuestionIndex.value + 1) / questions.value.length) * 100
      : 0
  );

  const questionTimePercentage = computed(
    () =>
      (questionTimeLeft.value / timerSettings.value.questionTime) * 100
  );

  function startQuestionTimer() {
    stopQuestionTimer();

    questionTimeLeft.value = timerSettings.value.questionTime;
    timerWarning.value = false;

    questionTimerInterval = window.setInterval(() => {
      questionTimeLeft.value--;

      if (questionTimeLeft.value <= 5 && questionTimeLeft.value > 0) {
        timerWarning.value = true;
      }

      if (questionTimeLeft.value <= 0) {
        stopQuestionTimer();
        handleTimeout();
      }
    }, 1000);
  }

  function stopQuestionTimer() {
    if (questionTimerInterval !== null) {
      clearInterval(questionTimerInterval);
      questionTimerInterval = null;
    }

    timerWarning.value = false;
  }

  function handleTimeout() {
    if (gameState.value === 'playing') {
      selectedAnswer.value = null;
      isCorrect.value = false;
      gameState.value = 'timeout';
    }
  }

  async function loadCategories() {
    categoriesLoading.value = true;

    try {
      const response = await fetchCategories();
      categories.value = response.trivia_categories;
    } catch (e) {
      console.error('Failed to load categories:', e);

      categories.value = [
        { id: 9, name: 'General Knowledge' },
        { id: 10, name: 'Entertainment: Books' },
        { id: 11, name: 'Entertainment: Film' },
        { id: 12, name: 'Entertainment: Music' },
        { id: 14, name: 'Entertainment: Television' },
        { id: 15, name: 'Entertainment: Video Games' },
        { id: 17, name: 'Science & Nature' },
        { id: 18, name: 'Science: Computers' },
        { id: 21, name: 'Sports' },
        { id: 22, name: 'Geography' },
        { id: 23, name: 'History' },
        { id: 24, name: 'Politics' }
      ];
    } finally {
      categoriesLoading.value = false;
    }
  }

  function registerPlayer(
    name: string,
    category: number,
    difficulty: Difficulty,
    settings?: Partial<TimerSettings>
  ) {
    playerInfo.value = {
      name: name || 'Anonymous Player',
      category,
      difficulty
    };

    if (settings) {
      timerSettings.value = {
        ...timerSettings.value,
        ...settings
      };
    }

    gameState.value = 'start';
  }

  async function startGame() {
    loading.value = true;
    error.value = null;

    try {
      questions.value = await fetchQuestions(playerInfo.value);

      if (questions.value.length === 0) {
        throw new Error(
          'No questions available for the selected criteria'
        );
      }

      currentQuestionIndex.value = 0;
      score.value = 0;
      selectedAnswer.value = null;
      isCorrect.value = null;
      gameState.value = 'playing';

      // ✅ Reset and set anti-cheat for first question
      antiCheat.resetAntiCheat();
      if (questions.value[0]) {
        antiCheat.setCurrentQuestion(questions.value[0]);
      }

      startQuestionTimer();
    } catch (e) {
      error.value =
        'Failed to load questions. Please try different settings.';
      gameState.value = 'start';
    } finally {
      loading.value = false;
    }
  }

  function submitAnswer(answer: string) {
    if (gameState.value !== 'playing' || !currentQuestion.value) return;

    stopQuestionTimer();

    selectedAnswer.value = answer;
    isCorrect.value = answer === currentQuestion.value.correctAnswer;

    if (isCorrect.value) {
      score.value++;

      if (questionTimeLeft.value > 20) {
        score.value += 0.5;
      }
    }

    gameState.value = 'answered';
  }

  function nextQuestion() {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
      selectedAnswer.value = null;
      isCorrect.value = null;
      gameState.value = 'playing';

      // ✅ Set anti-cheat for next question
      const nextQuestion = questions.value[currentQuestionIndex.value];
      if (nextQuestion) {
        antiCheat.setCurrentQuestion(nextQuestion);
      }

      startQuestionTimer();
    } else {
      gameState.value = 'gameover';
    }
  }

  function resetGame() {
    stopQuestionTimer();

    // ✅ Reset anti-cheat
    antiCheat.resetAntiCheat();

    gameState.value = 'registration';
    questions.value = [];
    currentQuestionIndex.value = 0;
    score.value = 0;
    selectedAnswer.value = null;
    isCorrect.value = null;
    questionTimeLeft.value = timerSettings.value.questionTime;
    timerWarning.value = false;

    playerInfo.value = {
      name: '',
      category: 0,
      difficulty: 'any'
    };
  }

  onUnmounted(() => {
    stopQuestionTimer();
  });

  return {
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
    // ✅ Return actual anti-cheat values
    showWarning: antiCheat.showWarning,
    warningMessage: antiCheat.warningMessage,
    tabSwitchCount: antiCheat.tabSwitchCount,
    questionChanged: antiCheat.questionChanged,
    loadCategories,
    registerPlayer,
    startGame,
    submitAnswer,
    nextQuestion,
    resetGame
  };
}