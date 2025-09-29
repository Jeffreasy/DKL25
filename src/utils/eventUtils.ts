// src/utils/eventUtils.ts

/**
 * Utility functie om te controleren of er een input element actief is
 * Dit voorkomt dat globale event listeners interfereren met input elementen
 */
export const isInputActive = (): boolean => {
  const activeElement = document.activeElement as HTMLElement | null;
  return activeElement !== null && (
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.tagName === 'SELECT' ||
    activeElement.contentEditable === 'true' ||
    activeElement.getAttribute('role') === 'textbox'
  );
};

/**
 * Utility functie om te controleren of een event listener mag reageren
 * op basis van het actieve element
 */
export const shouldHandleKeyboardEvent = (): boolean => {
  return !isInputActive();
};

/**
 * Utility functie voor keydown event handlers die input checks bevatten
 */
export const createKeyboardHandler = (
  handler: (e: KeyboardEvent) => void
) => {
  return (e: KeyboardEvent) => {
    if (!shouldHandleKeyboardEvent()) {
      return;
    }
    handler(e);
  };
};