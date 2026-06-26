export function useSecurity() {
  // Disable right-click context menu
  function disableContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }

  // Disable keyboard shortcuts for copy/paste
  function disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+P
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'p')) {
        e.preventDefault();
        return false;
      }
      
      // Block F12 (Dev Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Block Ctrl+Shift+I (Dev Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
    });
  }

  // Disable text selection
  function disableTextSelection() {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
  }

  // Enable text selection (when quiz is over)
  function enableTextSelection() {
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  }

  // Detect DevTools
  function detectDevTools() {
    const threshold = 160;
    
    setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        console.clear();
        console.log('%c⚠️ Developer tools detected!', 'color: red; font-size: 20px;');
        console.log('%cPlease close developer tools to continue the quiz.', 'color: orange;');
      }
    }, 1000);
  }

  return {
    disableContextMenu,
    disableKeyboardShortcuts,
    disableTextSelection,
    enableTextSelection,
    detectDevTools
  };
}