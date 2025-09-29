# Event Listeners Documentation

Dit document beschrijft alle event listeners in de applicatie en hun scope.

## Keyboard Event Listeners

### ✅ **Goed gescoped (geen input interferentie):**

#### 1. **MobileMenu.tsx**
- **Event**: `keydown` (alleen Escape)
- **Scope**: Alleen actief wanneer menu open is
- **Doel**: Sluit menu met Escape toets
- **Status**: ✅ Geen probleem

### ✅ **Gefixed (input checks toegevoegd):**

#### 2. **VideoGallery.tsx**
- **Event**: `keydown` (pijltoetsen)
- **Scope**: Alleen actief wanneer geen input element actief
- **Doel**: Navigatie tussen video's
- **Status**: ✅ Gefixed met `shouldHandleKeyboardEvent()`

#### 3. **ImageModal.tsx**
- **Event**: `keydown` (pijltoetsen, spatie, escape)
- **Scope**: Alleen actief wanneer modal open is EN geen input element actief
- **Doel**: Navigatie, zoom, sluiten
- **Status**: ✅ Gefixed met `shouldHandleKeyboardEvent()`

#### 4. **usePhotoGallery.ts**
- **Event**: `keydown` (pijltoetsen, spatie)
- **Scope**: Alleen actief wanneer geen input element actief
- **Doel**: Navigatie en auto-play toggle
- **Status**: ✅ Gefixed met `shouldHandleKeyboardEvent()`

#### 5. **useVideoNavigation.ts**
- **Event**: `keydown` (pijltoetsen)
- **Scope**: Alleen actief wanneer geen input element actief
- **Doel**: Navigatie tussen video's
- **Status**: ✅ Gefixed met `shouldHandleKeyboardEvent()`

## Non-Keyboard Event Listeners

### ✅ **Goed gescoped (geen probleem):**

#### 1. **VideoSlide.tsx**
- **Event**: `message` (iframe communicatie)
- **Scope**: Window level
- **Doel**: Communicatie met YouTube iframe
- **Status**: ✅ Geen probleem

#### 2. **ScrollToTopButton.tsx**
- **Event**: `scroll` (passive)
- **Scope**: Window level
- **Doel**: Toon/verberg scroll-to-top button
- **Status**: ✅ Geen probleem

#### 3. **RadioPlayer.tsx**
- **Event**: `timeupdate`, `loadedmetadata`, `ended`, `error`
- **Scope**: Audio element specifiek
- **Doel**: Audio player functionaliteit
- **Status**: ✅ Geen probleem

#### 4. **Navbar.tsx**
- **Event**: `scroll` (passive)
- **Scope**: Window level
- **Doel**: Navbar styling op scroll
- **Status**: ✅ Geen probleem

#### 5. **ThumbnailSlider.tsx**
- **Event**: `scroll`, `resize`
- **Scope**: Element specifiek
- **Doel**: Thumbnail slider functionaliteit
- **Status**: ✅ Geen probleem

#### 6. **usePartnerCarousel.ts**
- **Event**: `resize`
- **Scope**: Window level
- **Doel**: Responsive carousel
- **Status**: ✅ Geen probleem

## Utility Functions

### `shouldHandleKeyboardEvent()`
Controleert of een keyboard event handler mag reageren op basis van het actieve element.

```typescript
export const shouldHandleKeyboardEvent = (): boolean => {
  return !isInputActive();
};
```

### `isInputActive()`
Controleert of er een input element actief is.

```typescript
export const isInputActive = (): boolean => {
  const activeElement = document.activeElement;
  return activeElement !== null && (
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.tagName === 'SELECT' ||
    activeElement.contentEditable === 'true' ||
    activeElement.getAttribute('role') === 'textbox'
  );
};
```

## Best Practices

1. **Gebruik `shouldHandleKeyboardEvent()`** voor alle keyboard event listeners
2. **Scope event listeners** zo specifiek mogelijk
3. **Cleanup event listeners** in useEffect cleanup functies
4. **Documenteer event listeners** in dit bestand
5. **Test input functionaliteit** na het toevoegen van nieuwe event listeners

## Test Checklist

- [ ] Spaties werken in chat input
- [ ] Enter werkt in chat input
- [ ] Pijltoetsen werken in galleries (wanneer geen input actief)
- [ ] Escape sluit modals
- [ ] Scroll functionaliteit werkt
- [ ] Audio player werkt
- [ ] Responsive functionaliteit werkt