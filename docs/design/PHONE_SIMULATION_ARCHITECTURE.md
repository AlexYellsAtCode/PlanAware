# Phone Simulation Architecture Separation

## Overview

The phone UI chrome (status bar with time, WiFi/signal bars, battery indicator) has been **architecturally separated** from the core application logic. This ensures:

1. **Desktop/Web Mode**: Phone mockup frame displays with simulated status bar (for demo purposes)
2. **Mobile/PWA Mode**: App displays full-screen without duplicate UI elements
3. **No Duplication**: Actual mobile devices will NOT have overlapping system chrome

## Changes Made

### New Files Created

#### 1. `src/utils/deviceDetection.js`
Utility functions to detect the running environment:
- `isMobileEnvironment()`: Detects if running on mobile/PWA/native app
  - Checks for PWA standalone mode
  - Checks mobile user agent
  - Checks viewport width (< 768px)
  - Respects `VITE_MOBILE_MODE` environment variable for testing
- `isMobileViewport()`: Detects mobile-sized viewport

#### 2. `src/components/StatusBar.jsx`
Extracted status bar component showing:
- Current time
- Cell signal bars (4 bars)
- Battery indicator (100%)

#### 3. `src/components/PhoneFrameWrapper.jsx`
Conditional wrapper component that:
- **On Desktop**: Renders phone mockup frame with StatusBar
  - `<main className="page-shell">` (centered page)
  - `<div className="phone-frame">` (phone mockup)
  - `<StatusBar />` (simulated OS chrome)
  - `<section className="app-card">` (app content wrapper)
- **On Mobile**: Renders full-screen responsive layout
  - `<div className="mobile-app-shell">` (full-screen container)
  - No phone frame, no status bar
  - App content takes full viewport

### Modified Files

#### 1. `src/App.jsx`
- Added imports for device detection and wrapper components
- Added `isMobileMode` state that detects environment on mount
- Added useEffect to re-detect on window resize (for responsive design)
- Wrapped return statement with `<PhoneFrameWrapper>` component
- Removed hardcoded status bar markup
- Content now flows through wrapper's conditional rendering

#### 2. `src/styles.css`
Added responsive styles:
- `.page-shell`: Desktop centered layout
- `.phone-frame`: Phone mockup styling (unchanged)
- `.mobile-app-shell`: New full-screen mobile layout
  - Full viewport height
  - Full width (no frame)
  - Removed rounded corners and shadow
  - Responsive padding

## How It Works

### Desktop Environment (Web Browser)
```
┌─────────────────────────────────┐
│      Browser Window             │
├─────────────────────────────────┤
│                                 │
│    ╔═══════════════════════╗    │
│    ║  10:36    📶 100%     ║ ← StatusBar
│    ╠═══════════════════════╣    │
│    ║   Thursday    Capacity║    │
│    ║   11/05         0%   ║    │
│    ║      TODAY           ║    │
│    ║  [Timeline...]       ║    │
│    ║  [Tasks...]          ║    │
│    ║  [Navigation]        ║    │
│    ╚═══════════════════════╝    │
│                                 │
└─────────────────────────────────┘
```

- Phone frame mimics iOS/Android appearance
- Simulated status bar for demo/mockup purposes
- Content displays within frame constraints

### Mobile Environment (Phone/PWA)
```
┌─────────────────────┐
│ Real OS Status Bar  │ ← System chrome (10:36 📶 100%)
├─────────────────────┤
│  Thursday           │
│  11/05              │
│   TODAY             │
│ [Timeline...]       │
│ [Tasks...]          │
│ [Navigation]        │
├─────────────────────┤
│ Real OS Nav Bar     │ ← System navigation
└─────────────────────┘
```

- Full-screen responsive layout
- NO phone frame mockup
- NO duplicate status bar (uses OS chrome)
- Scales to device width/height
- Safe for installation as PWA

## Testing the Separation

### Test Desktop Mode (Default)
```bash
npm run dev
# Open http://localhost:5173
# Phone frame visible with simulated status bar ✓
```

### Test Mobile Mode (Environment Variable)
```bash
VITE_MOBILE_MODE=true npm run dev
# Phone frame hidden
# Full-screen mobile layout shown ✓
```

### Test Responsive (Browser Resize)
1. Open dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Viewport resizes
4. Component automatically re-detects and switches layout
5. Watch transitions between phone frame ↔ mobile layout

## Installation Scenarios

### Scenario 1: Installing as PWA on Mobile Device
```
✓ App detects mobile environment
✓ Renders full-screen responsive layout
✓ No phone frame
✓ No duplicate status bar
✓ Uses system chrome instead
✗ No visual duplication
```

### Scenario 2: Installing as PWA on Desktop/Tablet
```
✓ App detects non-mobile environment (or small viewport triggers mobile)
✓ Behavior depends on device/viewport
✓ Can be controlled via VITE_MOBILE_MODE
```

### Scenario 3: Web Browser (Desktop)
```
✓ Phone frame mockup displays
✓ Simulated status bar shows time/battery
✓ Perfect for design reviews, demos, prototypes
✓ Responsive to window resize
```

## Key Design Decisions

1. **Detection Strategy**: Multi-factor (standalone mode + user agent + viewport)
   - Prevents false positives
   - Respects PWA install state
   - Handles edge cases (tablets, large-viewport mobile devices)

2. **Environment Variable**: `VITE_MOBILE_MODE`
   - Allows explicit override for testing
   - Enables CI/CD testing of both modes
   - Documented for developer reference

3. **Responsive Breakpoint**: 768px
   - Common mobile/tablet boundary
   - Aligns with Tailwind/Bootstrap standards
   - Tunable if needed

4. **Component Isolation**: PhoneFrameWrapper
   - Single responsibility (conditional rendering)
   - Easy to understand and modify
   - Keeps App.jsx logic clean

## Migration Path for Future Work

### If You Want to Remove Phone Frame Entirely
1. Set `VITE_MOBILE_MODE=false` by default in `.env`
2. Test responsive layout at various viewport sizes
3. Adjust styles in `mobile-app-shell` as needed
4. Component automatically renders mobile layout everywhere

### If You Want More Sophisticated Detection
Update `src/utils/deviceDetection.js`:
```javascript
// Add platform-specific checks
// Check for native bridge (React Native, Cordova, etc.)
// Check for specific app user agents
// Add per-platform handlers
```

## Accessibility & Performance

- **Accessibility**: Status bar is `aria-hidden="true"` (decorative on desktop)
- **Performance**: 
  - No additional runtime cost (detection runs once on mount)
  - Re-detection uses ResizeObserver pattern (efficient)
  - Same JavaScript bundle for all environments
  - Conditional CSS for layout variants

## Browser Support

- Desktop Browsers: All (Chrome, Firefox, Safari, Edge)
- Mobile Browsers: iOS Safari 14.5+, Chrome 90+
- PWA Installation: Modern browsers with Web App Manifest support

## Testing Checklist

- [x] Desktop browser shows phone frame
- [x] Status bar displays correct time and icons
- [x] Mobile mode flag hides phone frame
- [x] Responsive resize switches layouts
- [x] Build succeeds without errors
- [x] App functionality unchanged
- [ ] PWA installation on iOS (manual testing)
- [ ] PWA installation on Android (manual testing)
- [ ] Tablet viewport behavior (iPad, etc.)
