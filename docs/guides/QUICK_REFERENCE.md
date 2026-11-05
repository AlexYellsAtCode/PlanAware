# Quick Reference

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser to the URL shown (usually http://localhost:5173/PlanAware/)
```

## Common Commands

```bash
npm run dev        # Start development server with empty data
npm run demo       # Start development server with sample seed data
npm run build      # Build for production with empty data
npm run build:demo # Build production version with sample seed data
npm run preview    # Preview production build locally
npm run deploy     # Build and deploy to GitHub Pages
```

**Tip**: Use `npm run demo` to explore the app with sample tasks and events pre-loaded. See [../demo/DEMO_MODE.md](../demo/DEMO_MODE.md) for details.

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main component (state, views, fake backend) |
| `src/main.jsx` | React entry point |
| `src/styles.css` | All styling |
| `index.html` | HTML template |
| `package.json` | Dependencies and scripts |
| `vite.config.js` | Vite configuration |

## State Variables in App.jsx

```javascript
const [tasks, setTasks] = useState([])          // List of all tasks
const [events, setEvents] = useState([])        // List of all events
const [view, setView] = useState('home')        // Current view: 'home', 'weekly', 'monthly'
const [selectedDate, setSelectedDate] = useState(new Date())  // Selected date for views
const [editingItem, setEditingItem] = useState(null)  // Item being edited
const [showAddMenu, setShowAddMenu] = useState(false) // Show floating add menu
const [searchQuery, setSearchQuery] = useState('')    // Current search filter
```

## Views

| View | Purpose | Navigation |
|------|---------|-----------|
| **Home** | Daily view; timeline, tasks, and events for selected date | Swipe left/right or use date picker |
| **Weekly** | Week overview; tasks grouped by time period ("Today", "Tomorrow", "This Week", "Later") | Swipe left/right to change week |
| **Monthly** | Calendar grid with capacity heatmap; visualize workload across month | Swipe left/right to change month |

## Task Structure

```javascript
{
  id: number,              // Auto-generated
  title: string,           // Required
  notes: string,           // Optional
  completed: boolean,      // Default: false
  priority: 'Low' | 'Medium' | 'High',  // Required
  due: string,             // Formatted date/time
  estimatedMinutes: number,// Hours*60
  difficulty: 1-5,         // Affects capacity
  category: string,        // 'work', 'learning', 'health', 'personal', etc.
  repeatType: string,      // Optional: 'daily', 'weekly-x', 'monthly', 'every-n-days'
  repeatWeekDays: number[],// If weekly-x: [0=Sun, 1=Mon, ..., 6=Sat]
  repeatEveryNDays: number,// If every-n-days: repeat interval
}
```

## Event Structure

```javascript
{
  id: number,           // Auto-generated
  title: string,        // Required
  notes: string,        // Optional
  date: string,         // YYYY-MM-DD format
  startHour: string,    // '00'-'12'
  startMinute: string,  // '00'-'59'
  startPeriod: 'AM' | 'PM',
  endHour: string,      // '00'-'12'
  endMinute: string,    // '00'-'59'
  endPeriod: 'AM' | 'PM',
  location: string,     // Optional
  category: string,     // Required
  repeatType: string,   // Optional, same as tasks
  repeatWeekDays: number[],  // If weekly
  repeatEveryNDays: number,  // If n-days
}
```

## Adding a Task (Code Example)

```javascript
const addTaskHandler = async (taskData) => {
  const newTask = await fakeBackend.addTask(taskData)
  setTasks([...tasks, newTask])
}

// Usage:
addTaskHandler({
  title: 'My Task',
  notes: 'Details',
  priority: 'High',
  due: 'Nov 05, 2026 02:00 PM',
  estimatedMinutes: 60,
  difficulty: 3,
  category: 'work'
})
```

## Capacity Calculation

```
Daily Capacity = Weighted Task Load + Event Duration

Weighted Task Load = Σ(estimatedMinutes × (difficulty / 5))
Event Duration = Σ(end_time - start_time)
```

**Color Coding**:
- Green: 0-25%
- Yellow: 25-50%
- Orange: 50-75%
- Red: 75%+

## Recurrence Types

| Type | Example | Required Fields |
|------|---------|-----------------|
| `daily` | Every day | `repeatType` |
| `weekly-x` | Tue & Thu | `repeatType`, `repeatWeekDays: [2, 4]` |
| `monthly` | Same date each month | `repeatType` |
| `every-n-days` | Every 3 days | `repeatType`, `repeatEveryNDays: 3` |

## Debugging Tips

```javascript
// Log all tasks
console.log(tasks)

// Log all events
console.log(events)

// Check current state
console.log({ view, selectedDate, editingItem })

// Debug fake backend delays (reduce for faster testing)
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms / 10))
}
```

## CSS Class Names (Common)

```css
.app              /* Main container */
.header           /* Top navigation bar */
.view             /* Current view container */
.task-list        /* Task list container */
.task-item        /* Individual task */
.event-item       /* Individual event */
.timeline         /* Daily timeline */
.calendar-grid    /* Monthly calendar */
.floating-menu    /* "+" button and menu */
.modal            /* Dialog/modal overlay */
.button           /* Interactive button */
.completed        /* Completed task styling */
.high-priority    /* High priority task */
.medium-priority  /* Medium priority task */
.low-priority     /* Low priority task */
```

## Environment Setup

**Requirements**:
- Node.js 18+
- npm 9+
- Git

**Check versions**:
```bash
node --version   # Should be v18+
npm --version    # Should be 9+
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

- ✗ Data resets on page refresh (no persistence)
- ✗ No backend integration (all data in-memory)
- ✗ No authentication (single user, no accounts)
- ✗ No mobile app (web-based only)
- ✗ No timezone support (uses browser timezone)
- ✗ No notifications or reminders
- ✗ All components in single App.jsx file

## Links

- **Repository**: https://github.com/AlexYellsAtCode/PlanAware
- **Live Site**: https://alexyellsatcode.github.io/PlanAware/
- **Docs**: See files in `docs/` folder
  - [ARCHITECTURE.md](./ARCHITECTURE.md) — System design and architecture
  - [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) — How to make changes
  - [DATA_MODEL.md](./DATA_MODEL.md) — Task and event structures
  - [FEATURES.md](./FEATURES.md) — Feature descriptions and use cases
  - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — Common issues and solutions

## Keyboard Shortcuts (Future)

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` or `Cmd+N` | New task |
| `Ctrl+K` or `Cmd+K` | Search |
| `Escape` | Close modal/menu |
| `→` | Next day/week/month |
| `←` | Previous day/week/month |

*Note: Keyboard shortcuts not yet implemented*

## Color Palette

```css
--primary: #007AFF        /* Blue, interactive elements */
--success: #34C759        /* Green, completed items */
--warning: #FF9500        /* Orange, warnings */
--danger: #FF3B30         /* Red, errors/high priority */
--secondary: #5AC8FA      /* Light blue, secondary actions */
--background: #F5F5F5     /* Light gray, backgrounds */
--text-primary: #000000   /* Black, main text */
--text-secondary: #666666 /* Gray, secondary text */
```

## Tips for Developers

1. **Use `clone()`** to avoid mutations: `clone(task)` instead of `{ ...task }`
2. **Use `useMemo`** for expensive calculations to avoid re-renders
3. **Use `useRef`** for touch event tracking
4. **Keep state in App.jsx** for simplicity (no context API yet)
5. **Comment non-obvious code**, but keep comments minimal
6. **Test in mobile view** using DevTools device emulation
7. **Hard refresh** after code changes: `Ctrl+Shift+R`
8. **Check console** first when debugging: `F12 → Console`

## Future Enhancements

- [ ] Persistent storage (localStorage, backend)
- [ ] Real backend API integration
- [ ] Component extraction and refactoring
- [ ] TypeScript support
- [ ] Unit and integration tests
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Notifications and reminders
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Advanced filtering and sorting
- [ ] Time tracking and analytics
- [ ] Collaboration and sharing
