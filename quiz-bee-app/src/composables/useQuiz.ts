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

  // Anti-cheat placeholders
  const showWarning = ref(false);
  const warningMessage = ref('');
  const tabSwitchCount = ref(0);
  const questionChanged = ref(false);

  // Timer related refs
  const questionTimeLeft = ref(30);
  const totalTimeLeft = ref(0);

  const timerSettings = ref<TimerSettings>({
    questionTime: 30,
    totalTime: 0
  });

  let questionTimerInterval: number | null = null;
  let totalTimerInterval: number | null = null;

  const timerWarning = ref(false);

  const currentQuestion = computed(
    () => questions.value[currentQuestionIndex.value] || null
  );

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

  function startTotalTimer() {
    stopTotalTimer();

    if (timerSettings.value.totalTime > 0) {
      totalTimeLeft.value = timerSettings.value.totalTime;

      totalTimerInterval = window.setInterval(() => {
        totalTimeLeft.value--;

        if (totalTimeLeft.value <= 0) {
          stopTotalTimer();
          stopQuestionTimer();
          gameState.value = 'gameover';
        }
      }, 1000);
    }
  }

  function stopTotalTimer() {
    if (totalTimerInterval !== null) {
      clearInterval(totalTimerInterval);
      totalTimerInterval = null;
    }
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

      startQuestionTimer();
      startTotalTimer();
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

      startQuestionTimer();
    } else {
      stopTotalTimer();
      gameState.value = 'gameover';
    }
  }

  function resetGame() {
    stopQuestionTimer();
    stopTotalTimer();

    gameState.value = 'registration';
    questions.value = [];
    currentQuestionIndex.value = 0;
    score.value = 0;
    selectedAnswer.value = null;
    isCorrect.value = null;
    questionTimeLeft.value = timerSettings.value.questionTime;
    totalTimeLeft.value = timerSettings.value.totalTime;
    timerWarning.value = false;

    showWarning.value = false;
    warningMessage.value = '';
    tabSwitchCount.value = 0;
    questionChanged.value = false;

    playerInfo.value = {
      name: '',
      category: 0,
      difficulty: 'any'
    };
  }

  onUnmounted(() => {
    stopQuestionTimer();
    stopTotalTimer();
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
  };
}