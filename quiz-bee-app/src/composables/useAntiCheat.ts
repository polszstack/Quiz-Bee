import { ref, onMounted, onUnmounted } from 'vue';
import type { QuestionWithAnswers } from '../types/quiz';

export function useAntiCheat() {
  const tabSwitchCount = ref(0);
  const warningMessage = ref('');
  const showWarning = ref(false);
  const isTabActive = ref(true);
  const currentQuestionOriginal = ref<QuestionWithAnswers | null>(null);
  const scrambledQuestion = ref<QuestionWithAnswers | null>(null);
  const questionChanged = ref(false);
  const lastScrambleTime = ref(0);

  function scrambleQuestion(question: QuestionWithAnswers): QuestionWithAnswers {
    // Create a modified version of the question to confuse cheaters
    const scrambled = { ...question };
    
    // Different scrambling techniques based on switch count
    if (tabSwitchCount.value === 1) {
      // Mild scrambling - add noise to answers
      scrambled.answers = question.answers.map((answer, index) => {
        const noise = generateNoise();
        // Randomly place noise before or after answer
        return Math.random() > 0.5 ? answer + noise : noise + answer;
      });
      
      // Slightly modify question
      scrambled.question = addDistraction(question.question);
      
    } else if (tabSwitchCount.value === 2) {
      // Medium scrambling - shuffle answers differently
      scrambled.answers = shuffleWithNoise(question.answers);
      scrambled.question = addDistraction(reverseWords(question.question));
      
    } else {
      // Aggressive scrambling - completely change appearance
      scrambled.answers = heavyScramble(question.answers);
      scrambled.question = heavyDistraction(question.question);
      scrambled.correctAnswer = question.correctAnswer + generateNoise();
    }
    
    lastScrambleTime.value = Date.now();
    return scrambled;
  }

  function shuffleWithNoise(answers: string[]): string[] {
    const shuffled = [...answers].sort(() => Math.random() - 0.5);
    return shuffled.map(answer => answer + generateNoise());
  }

  function heavyScramble(answers: string[]): string[] {
    return answers.map(answer => {
      const noise = generateNoise();
      const prefix = Math.random() > 0.5 ? noise : '';
      const suffix = Math.random() > 0.5 ? noise : '';
      return prefix + answer + suffix;
    });
  }

  function generateNoise(): string {
    const noises = [
      ' (verify source)',
      ' [citation needed]',
      ' - multiple sources',
      ' (check references)',
      ' [cross-reference required]',
      ' {see documentation}',
      ' <<confirm>>',
      ' ||validate||'
    ];
    return noises[Math.floor(Math.random() * noises.length)]!;
  }

  function addDistraction(question: string): string {
    const distractions = [
      '⚠️ VERIFY: ',
      '🔍 CHECK: ',
      '📚 RESEARCH: ',
      '🔎 CONFIRM: ',
      '❓ VALIDATE: ',
      '📖 REFERENCE: ',
      '🔬 EXAMINE: '
    ];
    return distractions[Math.floor(Math.random() * distractions.length)] + question;
  }

  function heavyDistraction(question: string): string {
    const templates = [
      `[SECURED] ${question} [VERIFY SOURCE]`,
      `🔒 ENCRYPTED: ${question} 🔒`,
      `⚠️ ${question.split(' ').sort(() => Math.random() - 0.5).join(' ')} ⚠️`,
      `VERIFY: ${question} (Multiple sources required)`,
    ];
    return templates[Math.floor(Math.random() * templates.length)]!;
  }

  function reverseWords(text: string): string {
    return text.split(' ').reverse().join(' ');
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      // User left the tab
      isTabActive.value = false;
      tabSwitchCount.value++;
      
      if (currentQuestionOriginal.value) {
        // Scramble the question
        scrambledQuestion.value = scrambleQuestion(currentQuestionOriginal.value);
        questionChanged.value = true;
      }
      
      // Show warning based on number of tab switches
      if (tabSwitchCount.value === 1) {
        showWarningMessage('⚠️ Warning: Tab switching detected! Question has been modified for security.');
      } else if (tabSwitchCount.value === 2) {
        showWarningMessage('🚫 Second warning: Question scrambled again. Please stay on this tab to avoid penalties.');
      } else if (tabSwitchCount.value === 3) {
        showWarningMessage('⛔ Multiple tab switches detected! Your quiz session has been flagged.');
      } else {
        showWarningMessage('🔴 EXCESSIVE TAB SWITCHING! Quiz integrity compromised.');
      }
    } else {
      // User came back to the tab
      isTabActive.value = true;
      
      // Randomly change the question again when they return
      if (currentQuestionOriginal.value && tabSwitchCount.value > 0) {
        scrambledQuestion.value = scrambleQuestion(currentQuestionOriginal.value);
        questionChanged.value = true;
      }
      
      // Hide warning after 5 seconds
      setTimeout(() => {
        if (Date.now() - lastScrambleTime.value > 4000) {
          showWarning.value = false;
        }
      }, 5000);
    }
  }

  function handleWindowBlur() {
    if (currentQuestionOriginal.value) {
      // Less aggressive than tab switch, but still scramble
      if (Math.random() > 0.5) {
        scrambledQuestion.value = scrambleQuestion(currentQuestionOriginal.value);
        questionChanged.value = true;
      }
    }
  }

  function handleWindowFocus() {
    // Check if user was away for a long time
    if (!isTabActive.value && currentQuestionOriginal.value) {
      scrambledQuestion.value = scrambleQuestion(currentQuestionOriginal.value);
      questionChanged.value = true;
    }
    isTabActive.value = true;
  }

  // Prevent copy attempts
  function handleCopyAttempt(e: ClipboardEvent) {
    e.preventDefault();
    const fakeText = generateFakeText();
    e.clipboardData?.setData('text/plain', fakeText);
    
    if (!showWarning.value) {
      showWarningMessage('🚫 Copying is disabled during the quiz!');
      setTimeout(() => {
        showWarning.value = false;
      }, 2000);
    }
  }

function generateFakeText(): string {
  const fakeTexts = [
    'This content is protected. Please do not copy.',
    'Copying is disabled for quiz integrity.',
    'Quiz Bee - Anti-Cheat Protection Active',
    '⚠️ This action has been logged.',
    'Please answer questions honestly!'
  ];

  return fakeTexts[Math.floor(Math.random() * fakeTexts.length)]!;
}

  // Prevent paste attempts
  function handlePasteAttempt(e: ClipboardEvent) {
    e.preventDefault();
    showWarningMessage('🚫 Pasting is disabled during the quiz!');
    setTimeout(() => {
      showWarning.value = false;
    }, 2000);
  }

  function showWarningMessage(message: string) {
    warningMessage.value = message;
    showWarning.value = true;
  }

  function setCurrentQuestion(question: QuestionWithAnswers) {
    currentQuestionOriginal.value = question;
    scrambledQuestion.value = null;
    questionChanged.value = false;
    lastScrambleTime.value = 0;
  }

  function getDisplayQuestion(): QuestionWithAnswers | null {
    if (questionChanged.value && scrambledQuestion.value) {
      return scrambledQuestion.value;
    }
    return currentQuestionOriginal.value;
  }

  function getOriginalAnswer(answer: string): string {
    // Clean the answer by removing noise
    return answer
      .replace(/\s*\(verify source\)/gi, '')
      .replace(/\s*\[citation needed\]/gi, '')
      .replace(/\s*-\s*multiple sources/gi, '')
      .replace(/\s*\(check references\)/gi, '')
      .replace(/\s*\[cross-reference required\]/gi, '')
      .replace(/\s*\{see documentation\}/gi, '')
      .replace(/\s*<<confirm>>/gi, '')
      .replace(/\s*\|\|validate\|\|/gi, '')
      .trim();
  }

  function resetAntiCheat() {
    tabSwitchCount.value = 0;
    warningMessage.value = '';
    showWarning.value = false;
    isTabActive.value = true;
    currentQuestionOriginal.value = null;
    scrambledQuestion.value = null;
    questionChanged.value = false;
    lastScrambleTime.value = 0;
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('copy', handleCopyAttempt);
    document.addEventListener('paste', handlePasteAttempt);
    
    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showWarningMessage('🚫 Right-click is disabled during the quiz!');
      setTimeout(() => {
        showWarning.value = false;
      }, 2000);
    });
    
    // Disable keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+P, Ctrl+A
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'p' || e.key === 'a')) {
        e.preventDefault();
        showWarningMessage('🚫 Keyboard shortcuts are disabled during the quiz!');
        setTimeout(() => {
          showWarning.value = false;
        }, 2000);
      }
      
      // Block F12 (Dev Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        showWarningMessage('🔒 Developer tools are disabled during the quiz!');
        setTimeout(() => {
          showWarning.value = false;
        }, 2000);
      }
      
      // Block Ctrl+Shift+I (Dev Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
      }
      
      // Block Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
    });
  });

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleWindowBlur);
    window.removeEventListener('focus', handleWindowFocus);
    document.removeEventListener('copy', handleCopyAttempt);
    document.removeEventListener('paste', handlePasteAttempt);
  });

  return {
    tabSwitchCount,
    warningMessage,
    showWarning,
    isTabActive,
    questionChanged,
    setCurrentQuestion,
    getDisplayQuestion,
    getOriginalAnswer,
    resetAntiCheat,
    scrambleQuestion
  };
}