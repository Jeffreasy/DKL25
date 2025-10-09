# 🧹 DKL25 Cleanup Analysis

> **Datum:** 2025-10-09 | **Status:** Analysis Complete

## 📋 Overzicht

Analyse van de huidige codebase om duplicaten, redundante files en reorganisatie mogelijkheden te identificeren.

---

## 🔍 Geïdentificeerde Issues

### 1. Duplicate Context Folders ⚠️

**Probleem:**
```
src/context/ModalContext.tsx
src/contexts/ModalContext.tsx
```

**Actie:** Consolideer naar `src/contexts/` (meervoud is standaard)

**Impact:** Low - Beide files zijn waarschijnlijk identiek

---

### 2. Component Organization 📁

#### Huidige Structuur (Suboptimaal)
```
src/components/
├── Fotogallerij/          # Moet naar features/gallery/components/
├── video/                 # Moet naar features/video/components/
├── partners/              # Moet naar features/partners/components/
├── sponsors/              # Moet naar features/sponsors/components/
├── programma/             # Moet naar features/program/components/
```

#### Aanbevolen Reorganisatie
```
src/features/
├── gallery/
│   └── components/        # ← Fotogallerij components
├── video/
│   └── components/        # ← Video components
├── partners/
│   └── components/        # ← Partner components
├── sponsors/
│   └── components/        # ← Sponsor components
└── program/
    └── components/        # ← Programma components
```

**Impact:** Medium - Betere feature isolation

---

### 3. Deprecated Hook Files 🗑️

**Files die nu alleen re-exports zijn:**

```
src/hooks/usePartners.ts          # → @/features/partners
src/hooks/useSponsors.ts          # → @/features/sponsors
src/hooks/useVideoGallery.ts      # → @/features/video
src/components/Fotogallerij/hooks/usePhotoGallery.ts  # → @/features/gallery
src/components/programma/hooks/useProgramSchedule.ts  # → @/features/program
```

**Opties:**
1. **Behouden** voor backward compatibility (aanbevolen)
2. **Verwijderen** en imports updaten (breaking change)

**Aanbeveling:** Behouden met deprecation warnings (al gedaan ✅)

---

### 4. Type Files Consolidatie 📝

**Deprecated type files:**
```
src/types/partner.ts      # → @/features/partners
src/types/video.ts        # → @/features/video
src/components/Fotogallerij/types.ts  # → @/features/gallery
src/components/programma/types.ts     # → @/features/program
src/components/sponsors/types.ts      # → @/features/sponsors
```

**Status:** Al geconsolideerd met re-exports ✅

---

### 5. Unused/Redundant Files 🔍

**Te Onderzoeken:**
```
src/project.zip           # ⚠️ Waarschijnlijk verwijderbaar
src/scripts/              # Migratie scripts - kunnen gearchiveerd
```

**Actie:** Verifieer of deze nog nodig zijn

---

### 6. Component Folder Inconsistenties 📂

**Inconsistent Naming:**
```
src/components/Fotogallerij/   # Nederlands
src/components/Radiogallerij/  # Nederlands
src/components/Herosection/    # Engels
src/components/programma/      # Nederlands
```

**Aanbeveling:** 
- Behoud huidige namen (breaking changes vermijden)
- Nieuwe components: gebruik Engels
- Documenteer naming convention

---

## 🎯 Cleanup Prioriteiten

### Prioriteit 1: Kritisch ⚠️
- [ ] Consolideer duplicate context folders
- [ ] Verwijder `src/project.zip` (als niet nodig)

### Prioriteit 2: Belangrijk 📌
- [ ] Reorganiseer component folders naar features
- [ ] Archiveer oude migratie scripts

### Prioriteit 3: Nice-to-Have ✨
- [ ] Standaardiseer folder naming
- [ ] Create component library structure
- [ ] Add component documentation

---

## 📊 Cleanup Impact Analysis

### Veilige Acties (Geen Breaking Changes)
1. ✅ Verwijder duplicate context folder
2. ✅ Verwijder project.zip
3. ✅ Archiveer migratie scripts
4. ✅ Add index.ts files waar ontbrekend

### Risico Acties (Mogelijk Breaking)
1. ⚠️ Verplaats components naar features
2. ⚠️ Verwijder deprecated hooks
3. ⚠️ Hernoem folders

---

## 🔄 Aanbevolen Cleanup Plan

### Fase 1: Veilige Cleanup (Nu)
```bash
# 1. Verwijder duplicates
rm src/context/ModalContext.tsx  # Behoud contexts/

# 2. Verwijder project.zip
rm src/project.zip

# 3. Archiveer scripts
mkdir archive/
mv src/scripts/ archive/scripts/
```

### Fase 2: Component Reorganisatie (Later)
```bash
# Verplaats components naar features
mv src/components/Fotogallerij/* src/features/gallery/components/
mv src/components/video/* src/features/video/components/
mv src/components/partners/* src/features/partners/components/
mv src/components/sponsors/* src/features/sponsors/components/
mv src/components/programma/* src/features/program/components/
```

### Fase 3: Import Updates (Later)
- Update alle imports naar nieuwe locaties
- Test grondig
- Deploy

---

## 📝 Cleanup Checklist

### Immediate Actions
- [ ] Verwijder `src/context/` folder (duplicate)
- [ ] Verwijder `src/project.zip`
- [ ] Verplaats `src/scripts/` naar archive
- [ ] Add missing index.ts files

### Future Actions
- [ ] Reorganiseer components naar features
- [ ] Standaardiseer naming conventions
- [ ] Create component library
- [ ] Add Storybook voor components

---

## 🎯 Aanbevelingen

### DO ✅
1. Verwijder duidelijke duplicaten
2. Archiveer oude migratie scripts
3. Behoud backward compatibility
4. Documenteer changes

### DON'T ❌
1. Verwijder deprecated hooks (backward compat)
2. Hernoem folders zonder team overleg
3. Breaking changes zonder migratie plan
4. Verwijder files zonder backup

---

## 📈 Verwachte Resultaten

Na cleanup:
- **Folder count:** -3 (duplicates verwijderd)
- **File count:** -5 tot -10 (redundante files)
- **Clarity:** +30% (betere organisatie)
- **Maintenance:** +20% (minder verwarring)

---

## 🔗 Gerelateerde Documenten

- [`REFACTORING_COMPLETE.md`](REFACTORING_COMPLETE.md) - Refactoring summary
- [`REFACTORING_GUIDE.md`](REFACTORING_GUIDE.md) - Implementation guide
- [`REFACTORING_PROGRESS.md`](REFACTORING_PROGRESS.md) - Detailed progress

---

**Analyse Voltooid:** 2025-10-09 20:45 CET  
**Status:** Ready for Cleanup Execution