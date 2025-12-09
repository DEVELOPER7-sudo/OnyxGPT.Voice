import { useEffect, useCallback } from 'react';

interface ShortcutHandlers {
  onSpeak?: () => void;
  onStop?: () => void;
  onDownload?: () => void;
  onToggleSettings?: () => void;
  onClearText?: () => void;
}

export function useKeyboardShortcuts({
  onSpeak,
  onStop,
  onDownload,
  onToggleSettings,
  onClearText,
}: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement
      ) {
        // Allow Ctrl+Enter in textarea for speak
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          onSpeak?.();
        }
        return;
      }

      // Ctrl/Cmd + Enter: Speak
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onSpeak?.();
      }

      // Escape: Stop
      if (event.key === 'Escape') {
        event.preventDefault();
        onStop?.();
      }

      // Ctrl/Cmd + S: Download
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onDownload?.();
      }

      // Ctrl/Cmd + ,: Toggle Settings
      if (event.key === ',' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onToggleSettings?.();
      }

      // Ctrl/Cmd + Backspace: Clear text
      if (event.key === 'Backspace' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
        event.preventDefault();
        onClearText?.();
      }
    },
    [onSpeak, onStop, onDownload, onToggleSettings, onClearText]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
