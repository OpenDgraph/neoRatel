import { useEffect } from 'react';

export const useKeyboardShortcuts = (handlers: {
  onDelete?: (event: KeyboardEvent) => void;
  onSave?: (event: KeyboardEvent) => void;
  onRun?: (event: KeyboardEvent) => void;
  onRemoveAll?: (event: KeyboardEvent) => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key); // Debug log

      // Ctrl/Cmd + S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        console.log('Save triggered'); // Debug log
        event.preventDefault();
        handlers.onSave?.(event);
      }
      
      // Shift + Delete
      if (event.shiftKey && event.key === 'Delete' || event.key === 'Backspace') {
        console.log('Delete triggered'); // Debug log
        event.preventDefault();
        handlers.onDelete?.(event);
      }

      // F10
      if (event.key === 'F10') {
        console.log('Run triggered'); // Debug log
        event.preventDefault();
        handlers.onRun?.(event);
      }

      // Ctrl/Cmd + Shift + Delete
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Delete' || event.key === 'Backspace') {
        console.log('Remove all triggered'); // Debug log
        event.preventDefault();
        handlers.onRemoveAll?.(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}; 
