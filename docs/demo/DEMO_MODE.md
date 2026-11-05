# Demo Mode Setup

PlanAware supports two deployment modes:

1. **Main App** - Lightweight version without phone simulation wrapper
2. **Demo App** - Includes phone frame mockup for desktop viewing with sample data

## Quick Start

### Development - Main App (Default)
```bash
npm run dev
```
Starts the application in development mode without phone simulation. Users can add their own data. Best for testing on actual mobile devices or core development.

### Development - Demo App
```bash
npm run dev:demo
```
Starts the application in development mode with:
- Phone frame mockup for desktop viewing
- Phone status bar with current time
- Pre-loaded sample tasks and events
- Device detection that hides the frame on actual mobile devices

This is useful for:
- Demonstrating application features on desktop
- Testing UI with realistic data
- Exploring views with populated data
- Onboarding new developers

## Production Builds

### Production - Main App (Default)
```bash
npm run build
```
Creates optimized production builds for both main and demo versions:
- `dist/index.html` - Main app without phone simulation (~0.19 KB entry)
- `dist/index-demo.html` - Demo app with phone frame (~1.61 KB entry)

### Production - Demo App Only
```bash
npm run build:demo
```
Creates an optimized production build of the demo version only with phone simulation and sample seed data pre-loaded.

## Architecture

### Entry Points

PlanAware uses a dual entry-point architecture:

**Main App** (`src/main.jsx`):
- Renders the App component directly
- No phone simulation wrapper
- Clean, lightweight bundle
- Best for production and mobile testing

**Demo App** (`src/main-demo.jsx`):
- Wraps App with `PhoneFrameWrapper` component
- Includes device detection for responsive behavior
- Manages phone status bar time display
- Includes phone frame styling for desktop preview
- Loads with seed data automatically

### How Seed Data Works

The seed data loading is controlled by the `VITE_USE_SEED_DATA` environment variable:

- When set to `'true'`: Seed tasks and events are loaded from `src/seedData.js`
- When set to `'false'` or undefined: The application starts with empty data

This approach keeps the application logic clean while providing an easy way to demonstrate features or populate the app with sample data for testing.

### Technical Implementation

**In src/App.jsx:**
```javascript
const shouldUseSeedData = import.meta.env.VITE_USE_SEED_DATA === 'true'
const seedTasks = shouldUseSeedData ? importedSeedTasks : []
const seedEvents = shouldUseSeedData ? importedSeedEvents : []
```

**In src/main-demo.jsx** (phone simulation wrapper):
```javascript
function AppWithPhoneFrame() {
  const [currentTime, setCurrentTime] = React.useState(() => new Date())
  const isMobileMode = isMobileEnvironment()

  React.useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <PhoneFrameWrapper currentTime={currentTime} isMobileMode={isMobileMode}>
      <App />
    </PhoneFrameWrapper>
  )
}
```

**In package.json:**
```json
{
  "scripts": {
    "dev": "vite",
    "dev:demo": "cross-env VITE_USE_SEED_DATA=true vite --mode demo",
    "build": "vite build",
    "build:demo": "cross-env VITE_USE_SEED_DATA=true vite build --mode demo"
  }
}
```

**In vite.config.js:**
```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        demo: './index-demo.html',
      },
    },
  },
})
```

## Seed Data

The demo mode includes 10 sample tasks and 2 recurring events:

### Sample Tasks
1. **Review Week Plan** (Low priority) - Sunday 10:00 AM
2. **CS 407 Reading Quiz Prep** (Medium priority) - Monday 7:30 PM
3. **Data Structures Homework** (High priority) - Tuesday 5:00 PM
4. **Gym Session** (Low priority, completed) - Tuesday 8:00 PM
5. **Lab Worksheet** (Medium priority) - Wednesday 2:30 PM
6. **Group Project Meeting Prep** (High priority) - Thursday 4:00 PM
7. **Draft Reflection Post** (Medium priority) - Thursday 9:00 PM
8. **Weekly Budget Check** (Low priority) - Friday 12:00 PM
9. **CS 466 Project Sprint** (High priority) - Friday 6:00 PM
10. **Laundry + Room Reset** (Medium priority) - Saturday 3:00 PM

### Sample Events
1. **CS 466 Lecture** - Tues/Thurs 9:30 AM - 10:45 AM (SEC 3437)
2. **CS 407 Lecture** - Tues/Thurs 11:00 AM - 12:15 PM (SERC 2036)

## Use Cases

### For Developers
- Quickly see the UI with realistic data during development
- Test features without manually creating lots of tasks
- Demonstrate how capacity visualization works
- Explore different views with populated data

### For Demos
- Show stakeholders and users how the app works
- Demonstrate planning workflows
- Showcase capacity management features
- Test different scenarios and interactions

### For Testing
- Consistent test environment across team
- Realistic data loads for performance testing
- Verify features work with multiple tasks/events
- Test edge cases with populated data

## Files Related to Demo Mode

- **src/seedData.js** - Contains seed tasks and events data
- **src/App.jsx** - Conditional import logic based on environment variable (no phone UI code)
- **src/main.jsx** - Main entry point (renders App directly)
- **src/main-demo.jsx** - Demo entry point (wraps App with phone frame)
- **src/components/PhoneFrameWrapper.jsx** - Phone mockup component (demo only)
- **src/components/StatusBar.jsx** - Phone status bar (demo only)
- **src/utils/deviceDetection.js** - Mobile detection (demo only)
- **index.html** - Main app entry HTML
- **index-demo.html** - Demo app entry HTML
- **vite.config.js** - Multi-entry-point build configuration
- **package.json** - npm scripts and cross-env configuration

## Environment Variables

### VITE_USE_SEED_DATA
- **Type**: String (`'true'` or `'false'`)
- **Default**: undefined (treated as `'false'`)
- **Purpose**: Controls whether seed data is loaded
- **Set by**: npm scripts via `cross-env`

## Cross-Platform Compatibility

The demo mode uses the `cross-env` npm package to ensure environment variables work correctly on:
- ✅ Windows (cmd.exe, PowerShell)
- ✅ macOS (bash, zsh)
- ✅ Linux (bash, sh)

This means `npm run dev:demo` and `npm run build:demo` work identically across all platforms.

## Troubleshooting

### Phone frame isn't showing in demo mode

1. Verify you're running `npm run dev:demo` (not `npm run dev`)
2. Check that all required files exist:
   - `src/main-demo.jsx`
   - `src/components/PhoneFrameWrapper.jsx`
   - `src/components/StatusBar.jsx`
   - `index-demo.html`
3. Check browser console for any errors

### Demo mode isn't loading seed data

1. Check that `cross-env` is installed:
   ```bash
   npm list cross-env
   ```

2. Verify the npm script is correct:
   ```bash
   npm run
   ```
   Should show `dev:demo` and `build:demo` scripts.

3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Seed data is loading when it shouldn't

1. Check that you're running `npm run dev` (without `:demo`)
2. Verify `VITE_USE_SEED_DATA` is not set in your environment:
   ```bash
   echo $VITE_USE_SEED_DATA
   ```

### Changes to seed data aren't reflecting

1. Stop the dev server and restart it
2. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache if needed

### Phone frame showing on mobile device

The phone frame should automatically hide on actual mobile devices due to device detection. If you see the frame on a mobile device:

1. Check `src/utils/deviceDetection.js` to ensure it's detecting your device correctly
2. Check browser console for any errors related to device detection
3. Test on a different device or browser to verify

## See Also

- [README.md](../../README.md) - Main project documentation
- [DEVELOPER_GUIDE.md](../guides/DEVELOPER_GUIDE.md) - Development setup and workflow
- [QUICK_REFERENCE.md](../guides/QUICK_REFERENCE.md) - Quick command reference
- [src/seedData.js](../../src/seedData.js) - Seed data source file

