# Shared Utilities Guide

Uitgebreide documentatie voor het gebruik van de shared style utilities in `src/styles/shared.ts`.

## 📚 Inhoudsopgave

1. [Colors](#colors)
2. [Common Class Combinations (cc)](#common-class-combinations-cc)
3. [Animations](#animations)
4. [Icons](#icons)
5. [Utilities](#utilities)
6. [Voorbeelden](#voorbeelden)

---

## Colors

Centraal beheerde kleur utilities voor consistente theming.

### Primary Colors
```typescript
import { colors } from '@/styles/shared'

// Background
colors.primary.bg          // 'bg-primary'
colors.primary.bgDark      // 'bg-primary-dark'
colors.primary.bgLight     // 'bg-primary-light'

// Text
colors.primary.text        // 'text-primary'
colors.primary.textDark    // 'text-primary-dark'
colors.primary.textLight   // 'text-primary-light'

// Border
colors.primary.border      // 'border-primary'
colors.primary.borderDark  // 'border-primary-dark'

// States
colors.primary.hover       // 'hover:bg-primary-dark'
colors.primary.focus       // 'focus:ring-primary'
colors.primary.focusRing   // 'focus:ring-2 focus:ring-primary focus:ring-offset-2'
```

### Social Media Colors
```typescript
// Facebook
colors.social.facebook.bg    // 'bg-social-facebook'
colors.social.facebook.hover // 'hover:bg-social-facebook'
colors.social.facebook.text  // 'text-social-facebook'

// Instagram, YouTube, LinkedIn - zelfde structuur
```

### Status Colors
```typescript
colors.status.success.bg     // 'bg-green-600'
colors.status.warning.text   // 'text-yellow-600'
colors.status.danger.border  // 'border-red-600'
colors.status.info.bg        // 'bg-blue-600'
```

---

## Common Class Combinations (cc)

### Grid Layouts
```typescript
import { cc } from '@/styles/shared'

// Responsive grid
cc.grid.responsive({ cols: 'photos' })  // Photo gallery grid
cc.grid.responsive({ cols: 'videos' })  // Video gallery grid
cc.grid.responsive({ cols: 'cards' })   // Card grid
cc.grid.base                             // Basic grid
```

### Flex Layouts
```typescript
cc.flex.center      // 'flex items-center justify-center'
cc.flex.between     // 'flex items-center justify-between'
cc.flex.start       // 'flex items-center justify-start'
cc.flex.end         // 'flex items-center justify-end'
cc.flex.col         // 'flex flex-col'
cc.flex.colCenter   // 'flex flex-col items-center justify-center'
cc.flex.wrap        // 'flex flex-wrap'
```

### Buttons
```typescript
cc.button.primary    // Primary button style
cc.button.secondary  // Secondary button style
cc.button.outline    // Outline button style
cc.button.ghost      // Ghost button style
cc.button.danger     // Danger button style
cc.button.disabled   // Disabled button style
```

### Cards
```typescript
cc.card.base      // Basic card
cc.card.hover     // Card with hover effect
cc.card.bordered  // Card with border
cc.card.elevated  // Card with elevated shadow
```

### Inputs
```typescript
cc.input.base     // Standard input
cc.input.error    // Input with error state
cc.input.disabled // Disabled input
```

### Typography
```typescript
cc.text.h1        // Heading 1 (responsive)
cc.text.h2        // Heading 2 (responsive)
cc.text.h3        // Heading 3 (responsive)
cc.text.h4        // Heading 4 (responsive)
cc.text.h5        // Heading 5 (responsive)
cc.text.body      // Body text
cc.text.small     // Small text
cc.text.muted     // Muted text color
cc.text.error     // Error text
```

### Typography Extended
```typescript
cc.typography.heading      // Font heading
cc.typography.body         // Font body
cc.typography.link         // Styled link
cc.typography.linkExternal // External link with icon
cc.typography.truncate     // Truncate text
cc.typography.uppercase    // Uppercase with tracking
```

### Containers
```typescript
cc.container.base    // Standard container
cc.container.narrow  // Narrow container (max-w-4xl)
cc.container.wide    // Wide container (max-w-7xl)
cc.container.section // Section spacing
```

### Modals
```typescript
cc.modal.overlay  // Modal overlay
cc.modal.content  // Modal content
cc.modal.header   // Modal header
cc.modal.body     // Modal body
cc.modal.footer   // Modal footer
```

### Loading States
```typescript
cc.loading.spinner  // Spinning loader
cc.loading.skeleton // Skeleton loader
cc.loading.overlay  // Loading overlay
```

### Transitions
```typescript
cc.transition.base      // Standard transition (300ms)
cc.transition.fast      // Fast transition (150ms)
cc.transition.slow      // Slow transition (500ms)
cc.transition.colors    // Color transition
cc.transition.transform // Transform transition
```

### Z-Index Layers
```typescript
cc.zIndex.base          // z-0
cc.zIndex.dropdown      // z-10
cc.zIndex.sticky        // z-20
cc.zIndex.fixed         // z-30
cc.zIndex.modalBackdrop // z-40
cc.zIndex.modal         // z-50
cc.zIndex.popover       // z-60
cc.zIndex.tooltip       // z-70
cc.zIndex.notification  // z-80
cc.zIndex.max           // z-100
```

### Tables
```typescript
cc.table.base     // Basic table
cc.table.striped  // Striped rows
cc.table.hover    // Hover effect
cc.table.bordered // Bordered table
cc.table.cell     // Table cell
cc.table.header   // Table header
cc.table.row      // Table row
```

### Lists
```typescript
cc.list.ul        // Unordered list
cc.list.ol        // Ordered list
cc.list.none      // No list style
cc.list.item      // List item
cc.list.itemHover // Hoverable list item
```

### Dropdowns
```typescript
cc.dropdown.menu       // Dropdown menu
cc.dropdown.item       // Dropdown item
cc.dropdown.itemActive // Active dropdown item
cc.dropdown.divider    // Dropdown divider
cc.dropdown.header     // Dropdown header
```

### Toasts/Notifications
```typescript
cc.toast.base     // Base toast
cc.toast.success  // Success toast
cc.toast.error    // Error toast
cc.toast.warning  // Warning toast
cc.toast.info     // Info toast
cc.toast.icon     // Toast icon
cc.toast.content  // Toast content
cc.toast.title    // Toast title
cc.toast.message  // Toast message
cc.toast.close    // Toast close button
```

### Forms Extended
```typescript
cc.form.group         // Form group spacing
cc.form.groupInline   // Inline form group
cc.form.label         // Form label
cc.form.labelRequired // Required field label
cc.form.hint          // Form hint text
cc.form.errorMessage  // Error message
cc.form.fieldset      // Fieldset
cc.form.legend        // Legend
```

### Accessibility Helpers
```typescript
cc.a11y.srOnly        // Screen reader only
cc.a11y.focusVisible  // Focus visible ring
cc.a11y.focusWithin   // Focus within ring
cc.a11y.skipLink      // Skip to content link
cc.a11y.notFocusable  // Not focusable
```

### Badges
```typescript
cc.badge.base     // Base badge
cc.badge.primary  // Primary badge
cc.badge.success  // Success badge
cc.badge.warning  // Warning badge
cc.badge.danger   // Danger badge
cc.badge.info     // Info badge
cc.badge.neutral  // Neutral badge
```

### Dividers
```typescript
cc.divider.horizontal // Horizontal divider
cc.divider.vertical   // Vertical divider
cc.divider.withText   // Divider with text
```

### Avatars
```typescript
cc.avatar.base // Base avatar
cc.avatar.sm   // Small avatar (32px)
cc.avatar.md   // Medium avatar (48px)
cc.avatar.lg   // Large avatar (64px)
cc.avatar.xl   // Extra large avatar (96px)
cc.avatar.ring // Avatar with ring
```

### Progress Bars
```typescript
cc.progress.container   // Progress container
cc.progress.bar         // Progress bar
cc.progress.barSuccess  // Success progress bar
cc.progress.barWarning  // Warning progress bar
cc.progress.barDanger   // Danger progress bar
```

### Chips/Tags
```typescript
cc.chip.base         // Base chip
cc.chip.primary      // Primary chip
cc.chip.secondary    // Secondary chip
cc.chip.removable    // Removable chip
cc.chip.removeButton // Remove button
```

---

## Animations

Gebaseerd op Tailwind config animations.

```typescript
import { animations } from '@/styles/shared'

// Fade
animations.fadeIn
animations.fadeOut

// Slide
animations.slideIn
animations.slideUp
animations.slideDown
animations.slideInRight

// Scale
animations.scaleIn
animations.scaleOut

// Pulse
animations.pulse
animations.pulseSlow

// Spin
animations.spin
animations.spinSlow

// Special effects
animations.float
animations.shine
animations.slide
animations.slideReverse
animations.partnerSlide
animations.hueRotate
```

---

## Icons

Voor Material Icons en custom icon styling.

### Sizes
```typescript
import { icons } from '@/styles/shared'

icons.xs    // w-3 h-3
icons.sm    // w-4 h-4
icons.md    // w-5 h-5
icons.lg    // w-6 h-6
icons.xl    // w-8 h-8
icons['2xl'] // w-10 h-10
```

### Material Icons
```typescript
icons.material.base  // material-icons-round
icons.material.sm    // material-icons-round text-sm
icons.material.md    // material-icons-round text-base
icons.material.lg    // material-icons-round text-lg
icons.material.xl    // material-icons-round text-xl
icons.material['2xl'] // material-icons-round text-2xl
```

### Colors
```typescript
icons.primary    // text-primary
icons.secondary  // text-gray-600
icons.success    // text-green-600
icons.warning    // text-yellow-600
icons.danger     // text-red-600
icons.info       // text-blue-600
```

### States
```typescript
icons.interactive // Clickable icon
icons.disabled    // Disabled icon
```

---

## Utilities

### cn() - Class Name Combiner
```typescript
import { cn } from '@/styles/shared'

// Combine classes
cn('base-class', condition && 'conditional-class', 'another-class')

// Filter out falsy values
cn('class1', false, null, undefined, 'class2') // 'class1 class2'
```

### responsive() - Responsive Classes
```typescript
import { utils } from '@/styles/shared'

utils.responsive(
  'text-base',    // base
  'text-lg',      // sm:
  'text-xl',      // md:
  'text-2xl',     // lg:
  'text-3xl'      // xl:
)
```

---

## Voorbeelden

### Button Component
```typescript
import { cc, cn, colors } from '@/styles/shared'

<button className={cn(
  cc.button.primary,
  colors.primary.focusRing,
  'w-full'
)}>
  Click me
</button>
```

### Card Component
```typescript
import { cc, cn } from '@/styles/shared'

<div className={cn(
  cc.card.hover,
  cc.spacing.component
)}>
  <h3 className={cc.text.h3}>Title</h3>
  <p className={cc.text.body}>Content</p>
</div>
```

### Form Input
```typescript
import { cc, cn, colors } from '@/styles/shared'

<div className={cc.form.group}>
  <label className={cc.form.labelRequired}>
    Email
  </label>
  <input 
    type="email"
    className={cn(
      cc.input.base,
      errors.email && cc.input.error
    )}
  />
  {errors.email && (
    <p className={cc.form.errorMessage}>
      {errors.email.message}
    </p>
  )}
</div>
```

### Modal
```typescript
import { cc, cn } from '@/styles/shared'

<div className={cc.modal.overlay}>
  <div className={cc.modal.content}>
    <div className={cc.modal.header}>
      <h2 className={cc.text.h2}>Title</h2>
    </div>
    <div className={cc.modal.body}>
      Content
    </div>
    <div className={cc.modal.footer}>
      <button className={cc.button.primary}>Save</button>
    </div>
  </div>
</div>
```

### Toast Notification
```typescript
import { cc, cn } from '@/styles/shared'

<div className={cn(cc.toast.base, cc.toast.success)}>
  <div className={cc.toast.icon}>✓</div>
  <div className={cc.toast.content}>
    <div className={cc.toast.title}>Success!</div>
    <div className={cc.toast.message}>Your changes have been saved.</div>
  </div>
</div>
```

### Table
```typescript
import { cc, cn } from '@/styles/shared'

<table className={cn(cc.table.base, cc.table.striped)}>
  <thead>
    <tr>
      <th className={cc.table.header}>Name</th>
      <th className={cc.table.header}>Email</th>
    </tr>
  </thead>
  <tbody>
    <tr className={cn(cc.table.row, cc.table.hover)}>
      <td className={cc.table.cell}>John Doe</td>
      <td className={cc.table.cell}>john@example.com</td>
    </tr>
  </tbody>
</table>
```

---

## Best Practices

1. **Gebruik cn() voor conditionals**
   ```typescript
   className={cn(cc.button.primary, isDisabled && cc.button.disabled)}
   ```

2. **Combineer utilities voor complexe styling**
   ```typescript
   className={cn(
     cc.card.base,
     cc.spacing.component,
     colors.primary.border,
     cc.transition.base
   )}
   ```

3. **Gebruik color utilities voor consistentie**
   ```typescript
   // ❌ Niet doen
   className="bg-[#ff9328]"
   
   // ✅ Wel doen
   className={colors.primary.bg}
   ```

4. **Gebruik accessibility helpers**
   ```typescript
   <button className={cn(
     cc.button.primary,
     cc.a11y.focusVisible
   )}>
     Click me
   </button>
   ```

5. **Gebruik z-index utilities voor layering**
   ```typescript
   <div className={cn(cc.modal.overlay, cc.zIndex.modal)}>
     Modal content
   </div>
   ```

---

## TypeScript Support

Alle utilities hebben TypeScript types voor betere autocomplete:

```typescript
import type { ColorKey, CCKey, AnimationKey, IconKey } from '@/styles/shared'

// Type-safe access
const colorKey: ColorKey = 'primary'
const ccKey: CCKey = 'button'
const animKey: AnimationKey = 'fadeIn'
const iconKey: IconKey = 'md'
```

---

## Bijdragen

Bij het toevoegen van nieuwe utilities:

1. Voeg ze toe aan de juiste sectie in `shared.ts`
2. Update deze documentatie
3. Voeg voorbeelden toe
4. Test de utilities in verschillende componenten

---

**Laatste update:** 2025-01-09
**Versie:** 2.0.0