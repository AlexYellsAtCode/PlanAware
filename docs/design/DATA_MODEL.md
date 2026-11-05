# Data Model

## Overview

PlanAware manages two primary entities: **Tasks** and **Events**. This document specifies their structure, relationships, and validation rules.

## Task Data Model

### Structure

```javascript
{
  id: number,                    // Unique identifier (timestamp-based or sequential)
  title: string,                 // Task name/title (required)
  notes: string,                 // Optional additional details
  completed: boolean,            // Completion status (default: false)
  priority: 'Low' | 'Medium' | 'High',  // Priority level
  due: string,                   // Due date and time formatted as "MMM DD, YYYY HH:MM AM/PM"
  estimatedMinutes: number,      // Estimated duration in minutes (0-999)
  difficulty: number,            // Difficulty rating (1-5 scale)
  category: string,              // Task category for filtering/organization
  
  // Recurrence fields (all optional)
  repeatType: string,            // 'daily' | 'weekly-x' | 'monthly' | 'every-n-days'
  repeatWeekDays: number[],      // For 'weekly-x': [0=Sun, 1=Mon, ..., 6=Sat]
  repeatEveryNDays: number,      // For 'every-n-days': repeat interval
}
```

### Field Specifications

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `id` | number | Yes | Unique | Generated on creation (Date.now() or auto-increment) |
| `title` | string | Yes | 1-200 chars | Displayed in all views |
| `notes` | string | No | 0-1000 chars | Additional task context |
| `completed` | boolean | No | - | Default: false |
| `priority` | string | Yes | 'Low'\|'Medium'\|'High' | Affects display styling |
| `due` | string | Yes | ISO 8601 or formatted | Date and time in user's timezone |
| `estimatedMinutes` | number | Yes | 0-999 | Used in capacity calculation |
| `difficulty` | number | Yes | 1-5 | Affects weighted load calculation |
| `category` | string | Yes | 1-50 chars | Examples: 'work', 'learning', 'health', 'personal' |
| `repeatType` | string | No | 'daily'\|'weekly-x'\|'monthly'\|'every-n-days' | None if not recurring |
| `repeatWeekDays` | number[] | No | [0-6] | Required if repeatType='weekly-x' |
| `repeatEveryNDays` | number | No | 1-365 | Required if repeatType='every-n-days' |

### Example Tasks

```javascript
// Simple one-time task
{
  id: 1,
  title: 'Review Week Plan',
  notes: 'Prioritize assignments',
  completed: false,
  priority: 'Low',
  due: 'Nov 05, 2026 10:00 AM',
  estimatedMinutes: 40,
  difficulty: 1,
  category: 'learning'
}

// Recurring daily task
{
  id: 2,
  title: 'Daily Standup',
  completed: false,
  priority: 'High',
  due: 'Nov 05, 2026 9:00 AM',
  estimatedMinutes: 15,
  difficulty: 1,
  category: 'work',
  repeatType: 'daily'
}

// Weekly task (Mon, Wed, Fri)
{
  id: 3,
  title: 'Gym Session',
  completed: false,
  priority: 'Medium',
  due: 'Nov 05, 2026 6:00 PM',
  estimatedMinutes: 60,
  difficulty: 2,
  category: 'health',
  repeatType: 'weekly-x',
  repeatWeekDays: [1, 3, 5]
}
```

## Event Data Model

### Structure

```javascript
{
  id: number,                    // Unique identifier
  title: string,                 // Event name (required)
  notes: string,                 // Optional additional details
  date: string,                  // Date in YYYY-MM-DD format
  startHour: string,             // Hour (00-12)
  startMinute: string,           // Minutes (00-59)
  startPeriod: 'AM' | 'PM',      // Time period
  endHour: string,               // Hour (00-12)
  endMinute: string,             // Minutes (00-59)
  endPeriod: 'AM' | 'PM',        // Time period
  location: string,              // Physical or virtual location
  category: string,              // Event category
  
  // Recurrence fields (optional, same as tasks)
  repeatType: string,            // 'daily' | 'weekly-x' | 'monthly' | 'every-n-days'
  repeatWeekDays: number[],      // For weekly recurrence
  repeatEveryNDays: number,      // For n-day recurrence
}
```

### Field Specifications

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `id` | number | Yes | Unique | Generated on creation |
| `title` | string | Yes | 1-200 chars | Displayed in timeline |
| `notes` | string | No | 0-500 chars | Event description |
| `date` | string | Yes | YYYY-MM-DD | Gregorian calendar format |
| `startHour` | string | Yes | '00'-'12' | 12-hour format |
| `startMinute` | string | Yes | '00'-'59' | Padded to 2 digits |
| `startPeriod` | string | Yes | 'AM'\|'PM' | Morning/afternoon indicator |
| `endHour` | string | Yes | '00'-'12' | Must be >= startHour |
| `endMinute` | string | Yes | '00'-'59' | Padded to 2 digits |
| `endPeriod` | string | Yes | 'AM'\|'PM' | - |
| `location` | string | No | 1-200 chars | Building, room, or URL |
| `category` | string | Yes | 1-50 chars | Examples: 'class', 'meeting', 'personal' |
| `repeatType` | string | No | Same as tasks | Optional recurrence |
| `repeatWeekDays` | number[] | No | [0-6] | For weekly events |
| `repeatEveryNDays` | number | No | 1-365 | For n-day events |

### Example Events

```javascript
// One-time event
{
  id: 101,
  title: 'Team Meeting',
  notes: 'Q4 planning discussion',
  date: '2026-11-05',
  startHour: '10',
  startMinute: '00',
  startPeriod: 'AM',
  endHour: '11',
  endMinute: '30',
  endPeriod: 'AM',
  location: 'Conference Room B',
  category: 'work'
}

// Recurring weekly event (Tue & Thu)
{
  id: 102,
  title: 'CS 407 Lecture',
  date: '2026-11-05',
  startHour: '11',
  startMinute: '00',
  startPeriod: 'AM',
  endHour: '12',
  endMinute: '15',
  endPeriod: 'PM',
  location: 'SERC 2036',
  category: 'learning',
  repeatType: 'weekly-x',
  repeatWeekDays: [2, 4]  // Tuesday (2) and Thursday (4)
}
```

## Recurrence Types

### 'daily'
- **Behavior**: Event/task repeats every single day
- **Required fields**: `repeatType`
- **Optional fields**: None

### 'weekly-x'
- **Behavior**: Repeats on specific days of the week
- **Required fields**: `repeatType`, `repeatWeekDays`
- **Notes**: `repeatWeekDays` is array of 0-6 (Sunday=0, Saturday=6)

### 'monthly'
- **Behavior**: Repeats on the same date each month
- **Required fields**: `repeatType`
- **Notes**: Handles edge cases (e.g., Feb 31st becomes last day of Feb)

### 'every-n-days'
- **Behavior**: Repeats every N days from the initial date
- **Required fields**: `repeatType`, `repeatEveryNDays`
- **Example**: `repeatEveryNDays: 3` means every 3 days

## Capacity Model

### Definition

**Capacity** is a metric representing daily workload, used in the monthly view's heatmap.

### Calculation

```
Daily Capacity = Weighted Task Load + Event Duration

Weighted Task Load = Σ(estimatedMinutes × (difficulty / 5)) for all tasks due that day
Event Duration = Σ(end_time - start_time in minutes) for all events on that day
```

### Capacity Levels (Color Coding)

- **0-25%**: Light green (low workload)
- **25-50%**: Yellow (moderate workload)
- **50-75%**: Orange (high workload)
- **75%+**: Red (very high workload)

### Example Calculation

**November 5, 2026:**

Tasks:
- Task 1: 40 min × (1/5) = 8 capacity points
- Task 2: 90 min × (2/5) = 36 capacity points
- Task 3: 180 min × (5/5) = 180 capacity points
- **Total Task Capacity**: 224 points

Events:
- Event 1: 9:30 AM - 10:45 AM = 75 minutes
- Event 2: 11:00 AM - 12:15 PM = 75 minutes
- **Total Event Duration**: 150 minutes

**Total Capacity**: 224 + 150 = 374 points
**Baseline Daily Capacity**: 480 minutes
**Utilization**: 374 / 480 = 77.9% → **Red (75%+ range)**

## Data Persistence

### Current (v0.1)
- **Storage**: In-memory JavaScript arrays
- **Persistence**: None (data resets on page refresh)
- **Lifespan**: Single browser session

### Planned Improvements
- localStorage for client-side persistence
- Backend database (PostgreSQL, MongoDB, etc.)
- Cloud sync across devices
- Backup and restore functionality

## Validation Rules

### Task Validation

```
✓ title is non-empty and ≤ 200 chars
✓ notes is ≤ 1000 chars
✓ priority is one of: 'Low', 'Medium', 'High'
✓ estimatedMinutes is a number > 0
✓ difficulty is an integer between 1-5
✓ category is non-empty and ≤ 50 chars
✓ due is a valid date/time in the future or today
✓ if repeatType is set, it must be one of: 'daily', 'weekly-x', 'monthly', 'every-n-days'
✓ if repeatType is 'weekly-x', repeatWeekDays array contains 0-6
✓ if repeatType is 'every-n-days', repeatEveryNDays is 1-365
```

### Event Validation

```
✓ title is non-empty and ≤ 200 chars
✓ notes is ≤ 500 chars
✓ date is valid YYYY-MM-DD format
✓ startHour and endHour are '00' to '12'
✓ startMinute and endMinute are '00' to '59'
✓ startPeriod and endPeriod are 'AM' or 'PM'
✓ end time is >= start time
✓ location is ≤ 200 chars
✓ category is non-empty and ≤ 50 chars
✓ recurrence fields follow same rules as tasks
```

## API Response Format

All fake backend methods return cloned task/event objects or arrays.

### Success Response
```javascript
// Single item
{ id: 1, title: '...', ... }

// Multiple items
[{ id: 1, ... }, { id: 2, ... }]
```

### Error Handling (Planned)
```javascript
// Error response format (future)
{
  error: string,
  code: string,
  details: object
}
```

## Category Taxonomy

### Suggested Categories

- **work**: Job-related tasks and meetings
- **learning**: Educational activities, classes, study
- **health**: Exercise, medical appointments
- **personal**: Household, errands, self-care
- **social**: Friends, family, events

Categories are flexible and user-defined; the above are suggestions from seed data.
