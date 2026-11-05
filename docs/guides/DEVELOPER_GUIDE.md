# Developer Guide

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AlexYellsAtCode/PlanAware.git
cd PlanAware
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically `http://localhost:5173/PlanAware/`)

## Development Workflow

### Available Scripts

```bash
npm run dev       # Start Vite dev server with hot module replacement (empty data)
npm run demo      # Start dev server with sample seed data loaded
npm run build     # Create production build in dist/ (empty data)
npm run build:demo # Create production build with sample seed data
npm run preview   # Serve the production build locally
npm run deploy    # Build and deploy to GitHub Pages (gh-pages branch)
```

**Demo Mode**: Use `npm run demo` to run the app with pre-populated sample tasks and events. This is useful for testing UI with realistic data or demonstrating features. See [../demo/DEMO_MODE.md](../demo/DEMO_MODE.md) for more details.

### Project Layout

```
src/
├── App.jsx       # Main application component (~800+ lines)
│                 # Contains:
│                 # - State management (tasks, events, UI state)
│                 # - Fake backend implementation
│                 # - All view components (home, weekly, monthly)
│                 # - Event handlers and calculations
│
├── main.jsx      # React DOM mount point
└── styles.css    # Single stylesheet for entire application
```

### Key Concepts to Understand

#### 1. State Management in App.jsx

The App component holds all state:

```javascript
const [tasks, setTasks] = useState([])
const [events, setEvents] = useState([])
const [view, setView] = useState('home')           // 'home', 'weekly', 'monthly'
const [selectedDate, setSelectedDate] = useState(new Date())
const [editingItem, setEditingItem] = useState(null)
const [showAddMenu, setShowAddMenu] = useState(false)
const [searchQuery, setSearchQuery] = useState('')
```

#### 2. Fake Backend

All API calls are simulated with artificial delays. To modify behavior:

```javascript
const fakeBackend = {
  async listTasks() {
    await wait(650)  // Adjust latency here
    return clone(fakeTasks)
  },
  // ... other methods
}
```

To add a new backend function:
1. Add the method to `fakeBackend`
2. Call it with `await fakeBackend.methodName()`
3. Update `fakeTasks` or `fakeEvents` accordingly

#### 3. Working with Tasks

Creating a task:
```javascript
const newTask = {
  title: 'My Task',
  notes: 'Task details',
  due: '2026-04-07 02:00 PM',
  priority: 'High',
  estimatedMinutes: 120,
  difficulty: 3,
  category: 'work'
}
const created = await fakeBackend.addTask(newTask)
setTasks([...tasks, created])
```

Toggling completion:
```javascript
const updated = await fakeBackend.toggleTask(taskId)
setTasks(tasks.map(t => t.id === taskId ? updated : t))
```

#### 4. Working with Events

Events use 24-hour-like storage but display in 12-hour format with AM/PM:

```javascript
const newEvent = {
  title: 'Class Meeting',
  date: '2026-04-07',
  startHour: '09',
  startMinute: '30',
  startPeriod: 'AM',
  endHour: '10',
  endMinute: '45',
  endPeriod: 'AM',
  location: 'Building 123',
  category: 'work'
}
```

#### 5. Recurring Items

Both tasks and events can repeat:

```javascript
// Daily repetition
repeatType: 'daily'

// Weekly on specific weekdays (0=Sunday, 6=Saturday)
repeatType: 'weekly-x'
repeatWeekDays: [2, 4]  // Tuesday and Thursday

// Every N days
repeatType: 'every-n-days'
repeatEveryNDays: 3

// Monthly (same date each month)
repeatType: 'monthly'
```

### Making Changes

#### Adding a New Feature

1. **Identify state needed**: Add to `useState` calls
2. **Add state handlers**: Create functions to update state
3. **Implement UI**: Add JSX for the feature
4. **Style it**: Add CSS to `styles.css`
5. **Test it**: Verify in dev server with `npm run dev`

#### Modifying the Fake Backend

1. Open `App.jsx` and locate the `fakeBackend` object
2. Modify the method or add a new one
3. Update `fakeTasks` or `fakeEvents` accordingly
4. Call the method from your UI handler

#### Working with Dates

PlanAware uses JavaScript `Date` objects internally and custom formatting for display:

```javascript
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

// Format date for display
const dateStr = date.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})
```

### Debugging

#### Enable Console Logging

Add logging to track state changes:

```javascript
useEffect(() => {
  console.log('Tasks updated:', tasks)
}, [tasks])
```

#### React DevTools

Install React DevTools browser extension to inspect component hierarchy and state.

#### Network Latency

Adjust the `wait()` function to test slow network scenarios:

```javascript
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms * 2))  // Double latency
}
```

### Testing Your Changes

1. Start the dev server: `npm run dev`
2. Open the app in your browser
3. Test the feature across different views (home, weekly, monthly)
4. Test on mobile by using browser DevTools' device emulation
5. Check console for errors: Press F12 → Console tab

### Building for Production

```bash
npm run build
```

This creates a production build in the `dist/` folder. The build:
- Minifies JavaScript and CSS
- Bundles React and Vite
- Optimizes assets for delivery

### Deploying to GitHub Pages

```bash
npm run deploy
```

This command:
1. Runs `npm run build`
2. Deploys the `dist/` folder to the `gh-pages` branch
3. Makes the site live at https://alexyellsatcode.github.io/PlanAware/

## Common Tasks

### Add a New Task Category

1. Modify seed data in `App.jsx` to include the category
2. Update any UI that displays category options
3. Ensure calculations handle the new category

### Change Capacity Calculation

1. Locate the capacity calculation function in `App.jsx`
2. Modify the formula
3. Test in the monthly view to verify colors update correctly

### Modify Styling

1. Open `src/styles.css`
2. CSS is organized by component/section
3. Use CSS variables (defined at the top) for consistency
4. Changes take effect immediately with hot reload

### Add Persistence (localStorage)

1. After `setTasks()`, store to localStorage:
```javascript
localStorage.setItem('planaware-tasks', JSON.stringify(tasks))
```

2. On app initialization:
```javascript
useEffect(() => {
  const saved = localStorage.getItem('planaware-tasks')
  if (saved) setTasks(JSON.parse(saved))
}, [])
```

## Troubleshooting

### Dev server won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Hot reload not working
- Save the file again
- Check browser console for errors
- Restart the dev server

### Build fails
- Check `npm run build` output for errors
- Ensure all dependencies are installed
- Verify `vite.config.js` configuration is correct

### Deployment fails
- Ensure `gh-pages` branch exists in repository
- Check GitHub Actions workflows
- Verify repository settings allow Pages deployment

## Performance Tips

- Use `useMemo` for expensive calculations
- Avoid inline object creation in render (affects equality checks)
- Keep components focused and small
- Lazy-load data when possible
- Profile with React DevTools Profiler

## Next Steps

- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design details
- Check [DATA_MODEL.md](./DATA_MODEL.md) for complete data specifications
- See [FEATURES.md](./FEATURES.md) for feature descriptions and use cases
