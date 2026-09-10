import { ref, onMounted, onUnmounted } from 'vue';

export function useAntiCheat() {
  const tabSwitchCount = ref(0);
  const warningMessage = ref('');
  const showWarning = ref(false);
  const isTabActive = ref(true);
  const isActive = ref(true);

  function handleVisibilityChange() {
    if (!isActive.value) return;
    
    if (document.hidden) {
      isTabActive.value = false;
      tabSwitchCount.value++;
      
      if (tabSwitchCount.value === 1) {
        showWarningMessage('⚠️ Tab switch detected! Please stay on this tab.');
      } else if (tabSwitchCount.value === 2) {
        showWarningMessage('⚠️ Second tab switch detected!');
      } else if (tabSwitchCount.value === 3) {
        showWarningMessage('⚠️ Third tab switch! One more and quiz will restart.');
      } else if (tabSwitchCount.value === 4) {
        showWarningMessage('🚫 Final warning! Next switch = quiz restart.');
      } else if (tabSwitchCount.value >= 5) {
        showWarningMessage('🔄 5 tab switches detected! Restarting quiz...');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } else {
      isTabActive.value = true;
      setTimeout(() => { showWarning.value = false; }, 3000);
    }
  }

  function showWarningMessage(message: string) {
    warningMessage.value = message;
    showWarning.value = true;
  }

  function resetAntiCheat() {
    tabSwitchCount.value = 0;
    warningMessage.value = '';
    showWarning.value = false;
    isTabActive.value = true;
    isActive.value = true;
  }

  function disableAntiCheat() {
    isActive.value = false;
  }

  function enableAntiCheat() {
    isActive.value = true;
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      showWarningMessage('🚫 Copying is disabled!');
      setTimeout(() => { showWarning.value = false; }, 2000);
    });
    
    document.addEventListener('paste', (e) => {
      e.preventDefault();
    });
    
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 'a', 'u'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'F12') e.preventDefault();
    });
  });

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return {
    tabSwitchCount,
    warningMessage,
    showWarning,
    isTabActive,
    resetAntiCheat,
    disableAntiCheat,
    enableAntiCheat,
  };
}