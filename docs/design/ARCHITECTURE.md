# PlanAware Architecture

## Overview

PlanAware is a Vite + React productivity application designed to help users manage tasks and calendar events in an integrated, mobile-style interface. The application focuses on workload awareness through daily, weekly, and monthly planning views.

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 8
- **Styling**: Plain CSS (single stylesheet)
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Package Manager**: npm
- **Backend**: Simulated (in-memory, no external API)

## Project Structure

```
PlanAware/
├── src/
│   ├── App.jsx          # Main component with state management & views
│   ├── main.jsx         # React DOM entry point
│   └── styles.css       # All application styles
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
└── dist/                # Production build output
```

## Core Architecture

### 1. **State Management**

PlanAware uses React hooks for state management:

- **useState**: Manages tasks, events, UI state (current view, selected date, edit mode)
- **useEffect**: Handles side effects (fetching data, swipe listeners)
- **useMemo**: Optimizes expensive calculations (filtering, grouping tasks)
- **useRef**: Captures touch events for swipe gestures

### 2. **Data Model**

#### Tasks
```javascript
{
  id: number,
  title: string,
  notes: string,
  completed: boolean,
  priority: 'Low' | 'Medium' | 'High',
  due: string (formatted date/time),
  estimatedMinutes: number,
  difficulty: 1-5,
  category: string,
  repeatType?: 'daily' | 'weekly-x' | 'monthly' | 'every-n-days',
  repeatWeekDays?: number[],
  repeatEveryNDays?: number
}
```

#### Events
```javascript
{
  id: number,
  title: string,
  notes: string,
  date: string (YYYY-MM-DD),
  startHour: string,
  startMinute: string,
  startPeriod: 'AM' | 'PM',
  endHour: string,
  endMinute: string,
  endPeriod: 'AM' | 'PM',
  location: string,
  category: string,
  repeatType?: 'daily' | 'weekly-x' | 'monthly' | 'every-n-days',
  repeatWeekDays?: number[],
  repeatEveryNDays?: number
}
```

### 3. **Fake Backend**

The application simulates a REST API using in-memory storage with artificial delays:

```javascript
const fakeBackend = {
  async listTasks() { ... },
  async addTask(task) { ... },
  async updateTask(id, updates) { ... },
  async deleteTask(id) { ... },
  async toggleTask(id) { ... },
  async listEvents() { ... },
  async addEvent(event) { ... },
  async updateEvent(id, updates) { ... },
  async deleteEvent(id) { ... }
}
```

Delays are configurable in the `wait()` function to simulate network latency.

### 4. **Views**

#### Home View (Daily Timeline)
- Displays tasks and events for a selected date
- Grouped by time blocks
- Toggle task completion
- Swipe left/right to navigate days

#### Weekly View
- Groups tasks into "Today / Tomorrow / This Week / Later" buckets
- Collapsible bucket sections
- Shows upcoming schedule
- Swipe to navigate weeks

#### Monthly View
- Calendar grid showing entire month
- Color-coded cells based on capacity utilization
- Capacity heatmap visualization
- Swipe to navigate months

### 5. **Capacity Calculation**

Capacity is calculated as:
```
Daily Capacity = Weighted Task Load + Event Duration
Weighted Task Load = Sum(estimatedMinutes × (difficulty / 5)) for all tasks
Event Duration = Sum(end_time - start_time) for all events
```

The baseline daily capacity is fixed, and exceeding it triggers higher color intensity in the monthly view.

### 6. **Recurring Items**

Both tasks and events support:
- **Daily**: Repeats every day
- **Weekly (selected weekdays)**: Repeats on specific days (0=Sunday, 6=Saturday)
- **Monthly**: Repeats on the same date each month
- **Every N Days**: Custom interval repetition

## Component Flow

```
App (root)
├── Navigation (buttons to switch views)
├── Home View
│   ├── DaySelector
│   ├── TimelineView
│   └── TaskList
├── Weekly View
│   └── TaskBuckets
├── Monthly View
│   └── CalendarGrid
└── FloatingAddMenu (global)
```

## Key Functions

### Utility Functions
- `formatWeekDue()`: Formats date/time display for tasks
- `shortPriority()`: Shortens priority labels for UI
- `clone()`: Deep clones objects for immutability
- `wait()`: Simulates API latency

### Calculations
- `calculateCapacity()`: Computes daily workload
- `getRecurringInstances()`: Expands recurring items across dates
- `filterByDateRange()`: Filters tasks/events by time period

## Data Flow

1. **Initialization**: `useEffect` loads seed data via `fakeBackend.listTasks()` and `fakeBackend.listEvents()`
2. **User Action**: User interacts with UI (add, edit, delete, toggle)
3. **State Update**: `setState` triggers state change
4. **Re-render**: React re-renders affected components
5. **Calculations**: `useMemo` recomputes derived data (filtered lists, capacity)
6. **Display**: UI displays updated state

## Styling Architecture

Single `styles.css` file organized by:
- Root variables (colors, spacing)
- Layout classes (containers, grids, flexbox)
- Component styles (buttons, cards, modals)
- Responsive design (media queries for mobile)
- Animation/transitions

## Performance Considerations

- **useMemo**: Prevents unnecessary recalculations of filtered task lists
- **clone()**: Ensures immutability, avoiding accidental mutations
- **Lazy rendering**: Only displays visible items in lists
- **CSS animations**: Hardware-accelerated for smooth transitions

## Future Architecture Improvements

- Extract components into separate files
- Implement context API for theme/user preferences
- Add TypeScript for type safety
- Integrate real backend API
- Implement proper state management (Redux, Zustand, etc.)
- Add data persistence (localStorage, IndexedDB, server database)
- Implement authentication & user profiles
