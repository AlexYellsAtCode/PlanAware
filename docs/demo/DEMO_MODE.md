# Demo Mode Setup

PlanAware now supports running with or without seed data. By default, the application starts with an empty task and event list. A demo mode is available that loads sample tasks and events for demonstration purposes.

## Quick Start

### Development with Empty Data (Default)
```bash
npm run dev
```
Starts the application in development mode with no initial tasks or events. Users can add their own data.

### Development with Demo Data
```bash
npm run demo
```
Starts the application in development mode with pre-loaded sample tasks and events. This is useful for:
- Demonstrating application features
- Testing with realistic data
- Exploring UI with populated views
- Onboarding new developers

## Production Builds

### Production without Seed Data (Default)
```bash
npm run build
```
Creates an optimized production build that starts with an empty task list.

### Production with Seed Data (Demo)
```bash
npm run build:demo
```
Creates an optimized production build with sample tasks and events pre-loaded.

## How It Works

The seed data is controlled by the `VITE_USE_SEED_DATA` environment variable:

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

**In package.json:**
```json
{
  "scripts": {
    "demo": "cross-env VITE_USE_SEED_DATA=true vite",
    "build:demo": "cross-env VITE_USE_SEED_DATA=true vite build"
  }
}
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
- **src/App.jsx** - Conditional import logic based on environment variable
- **package.json** - npm scripts and cross-env configuration
- **.env.demo** - Example environment configuration file

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

This means `npm run demo` and `npm run build:demo` work identically across all platforms.

## Troubleshooting

### Demo mode isn't loading seed data

1. Check that `cross-env` is installed:
   ```bash
   npm list cross-env
   ```

2. Verify the npm script is correct:
   ```bash
   npm run
   ```
   Should show both `demo` and `build:demo` scripts.

3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Seed data is loading when it shouldn't

1. Check that you're running `npm run dev` (without `demo`)
2. Verify `VITE_USE_SEED_DATA` is not set in your environment:
   ```bash
   echo $VITE_USE_SEED_DATA
   ```

### Changes to seed data aren't reflecting

1. Stop the dev server and restart it
2. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache if needed

## See Also

- [README.md](../../README.md) - Main project documentation
- [DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md) - Development setup and workflow
- [src/seedData.js](../../src/seedData.js) - Seed data source file
