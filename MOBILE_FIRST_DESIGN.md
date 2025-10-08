# Mobile-First Design Requirements

## Critical Context
**Primary Use Case**: Technicians conducting crit walks on-site using their phones
**Primary Device**: Mobile phones (iOS/Android)
**Secondary Use**: Managers on desktop reviewing data

---

## Mobile-First Design Principles

### 1. Touch-Friendly UI
- **Minimum touch target size**: 44x44px (Apple) / 48x48dp (Android)
- **Button spacing**: Minimum 8px between interactive elements
- **Primary actions**: Large, prominent buttons at bottom of screen (thumb-friendly)
- **Avoid**: Small links, tiny checkboxes, cramped dropdowns

### 2. Photo Capture Optimization
- **Direct camera access**: Use `<input type="file" accept="image/*" capture="environment">`
- **Quick capture flow**: Minimize steps between opening form and taking photo
- **Preview before upload**: Show thumbnail immediately after capture
- **Multiple photos**: Easy to add multiple photos in sequence
- **Photo guidelines**: Display equipment photo requirements BEFORE opening camera

### 3. One-Handed Operation
- **Navigation**: Bottom tab bar or hamburger menu (easy to reach with thumb)
- **Forms**: Single column layout, auto-advance to next field
- **Scrolling**: Natural vertical scrolling, no horizontal scroll
- **Primary actions**: Bottom-anchored floating action buttons

### 4. Simplified Navigation
- **Max depth**: 3 levels deep from home
- **Back button**: Always accessible (browser back or explicit back button)
- **Breadcrumbs**: Show current location clearly
- **Quick actions**: Equipment search/filter at top of every relevant page

### 5. Input Optimization
- **Dropdowns**: Native mobile select menus (better UX than custom)
- **Text input**: Appropriate keyboard types (number, email, text)
- **Autocomplete**: Use datalist for searchable dropdowns (like team member selection)
- **Voice input**: Consider for notes fields
- **Avoid**: Complex date pickers, multi-select dropdowns

### 6. Visual Design
- **Font sizes**: Minimum 16px for body text (prevents zoom on iOS)
- **Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Status indicators**: Large, color-coded with icons (not just color)
- **Loading states**: Clear feedback for every action
- **Error messages**: Prominent, actionable, at top of screen

### 7. Performance
- **Fast load**: Target <3s on 4G
- **Lazy loading**: Images and lists load as needed
- **Offline capability**: Cache critical data (future enhancement)
- **Progressive Web App**: Install on home screen (future enhancement)

---

## Component-Specific Mobile Considerations

### Login Page
- [ ] Large logo (centered, 96px+)
- [ ] Single password input (autofocus)
- [ ] Large "Login" button (full width)
- [ ] No tiny "forgot password" links

### User Selection
- [ ] Searchable dropdown with autocomplete
- [ ] Large name buttons (min 48px height)
- [ ] Clear visual feedback on selection
- [ ] Large role cards (easy to tap)
- [ ] Bottom-anchored "Continue" button

### Dashboard (Equipment List)
- [ ] Grid view: 1 column on mobile (full width cards)
- [ ] Large equipment cards (120px+ height)
- [ ] Clear status indicators (colored left border + icon)
- [ ] Search bar at top (sticky)
- [ ] Filter chips (horizontal scrollable)
- [ ] Floating "+" button for managers (bottom right)

### Equipment Detail Page
- [ ] Hero section: Equipment name + large status badge
- [ ] Photo guidelines shown prominently
- [ ] Large "Complete Crit Walk" button (fixed at bottom)
- [ ] Collapsible history (load on demand)
- [ ] Swipeable photo gallery

### Crit Walk Form
- [ ] Camera button: Large, primary action (full width)
- [ ] Photo preview grid: 2 columns max on mobile
- [ ] Remove photo: Large X button on each thumbnail
- [ ] Notes: Large textarea (min 4 rows)
- [ ] Submit: Bottom-anchored, always visible
- [ ] Progress indicator: "Photos: 2/3 required"

### Crit Walk History
- [ ] Timeline view (vertical)
- [ ] Compact cards (expandable for photos)
- [ ] Lazy load older entries
- [ ] Pull-to-refresh

---

## Tailwind CSS Mobile-First Classes

### Use These Patterns:
```css
/* Mobile first, then tablet, then desktop */
.class { }           /* Mobile default */
.md:class { }        /* Tablet (768px+) */
.lg:class { }        /* Desktop (1024px+) */

/* Example: Button */
.btn-primary {
  /* Mobile: Full width */
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem; /* 18px */
}

.md:btn-primary {
  /* Tablet+: Auto width */
  width: auto;
  padding: 0.75rem 1.5rem;
}
```

### Touch Target Sizing:
```css
/* Minimum touch targets */
.touch-target {
  min-height: 44px;  /* iOS guideline */
  min-width: 44px;
  padding: 0.75rem;  /* 12px */
}
```

### Spacing for Thumbs:
```css
/* Bottom actions (thumb-friendly) */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: white;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}
```

---

## Photo Capture Implementation

### Optimized Photo Upload Component:
```tsx
// Mobile-optimized photo input
<input
  type="file"
  accept="image/*"
  capture="environment"  // Opens back camera
  multiple                // Allow multiple selection
  className="hidden"
  ref={fileInputRef}
/>

// Large camera button
<button
  onClick={() => fileInputRef.current?.click()}
  className="w-full h-24 bg-brand-blue text-white rounded-lg text-xl"
>
  📷 Take Photo
</button>
```

---

## Testing Checklist (Mobile-Specific)

### Device Testing:
- [ ] iPhone SE (smallest modern iPhone - 375px width)
- [ ] iPhone 13/14 Pro (standard size - 390px width)
- [ ] Samsung Galaxy S21 (standard Android - 360px width)
- [ ] iPad Mini (tablet - 768px width)

### Functionality Testing:
- [ ] Camera access works on iOS Safari
- [ ] Camera access works on Android Chrome
- [ ] Photo upload from camera roll works
- [ ] All buttons are easily tappable (44px+)
- [ ] No accidental taps (proper spacing)
- [ ] Text is readable without zooming (16px+ body)
- [ ] Forms work with on-screen keyboard
- [ ] Bottom buttons don't get hidden by keyboard
- [ ] Horizontal scrolling doesn't occur
- [ ] Status colors are visible in sunlight (contrast)

### Performance Testing:
- [ ] Page loads in <3s on 4G
- [ ] Photo upload works on slow connection
- [ ] Smooth scrolling on lists
- [ ] No jank when opening keyboard

---

## Implementation Strategy

### Update Phase 8 (Components):
1. **All buttons**: Use `min-h-[44px] min-w-[44px]` classes
2. **Photo upload**: Large camera button, mobile capture attribute
3. **Forms**: Single column, full width on mobile
4. **Cards**: Full width on mobile, grid on tablet+

### Update Phase 9 (Pages):
1. **Navigation**: Bottom nav bar on mobile, sidebar on desktop
2. **Layout**: Stack vertically on mobile, side-by-side on desktop
3. **Actions**: Bottom-anchored on mobile, inline on desktop

### CSS Updates Needed:
```css
/* Update index.css buttons */
.btn-primary {
  padding: 0.875rem 1.5rem;  /* Larger padding for touch */
  font-size: 1.125rem;        /* 18px for readability */
  min-height: 48px;           /* Touch target */
}

/* Mobile-specific utilities */
.mobile-container {
  padding: 1rem;              /* Comfortable mobile padding */
  max-width: 100%;            /* Full width on mobile */
}

.md:mobile-container {
  padding: 1.5rem;
  max-width: 1024px;          /* Constrain on desktop */
  margin: 0 auto;
}
```

---

## Updated Success Criteria

✅ App is **mobile-first** - works perfectly on phones
✅ Camera integration is **seamless** - quick photo capture
✅ All actions are **thumb-friendly** - easy one-handed operation
✅ Text is **readable** without zooming
✅ Forms are **simple** - minimal typing required
✅ Performance is **fast** on 4G connection
✅ Desktop is **enhanced** version, not primary design

---

## Next Steps

**Before Phase 5 (Services)**: ✅ Services don't need mobile changes
**Before Phase 8 (Components)**: Update all component designs for mobile-first
**Before Phase 9 (Pages)**: Update all page layouts for mobile-first
**Before Phase 14 (Testing)**: Add comprehensive mobile device testing

---

**Remember**: Technicians will be standing next to equipment, phone in hand, often with gloves on. Make every interaction as simple and obvious as possible.
