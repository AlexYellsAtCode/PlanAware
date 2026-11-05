# Features & Use Cases

## Overview

This document describes PlanAware's features and their use cases, organized by view and interaction type.

## Core Features

### 1. Task Management

#### Create Tasks
**Use Case**: User needs to add a new task to their workload

**Steps**:
1. User clicks the floating "+" button
2. Selects "Add Task" from the menu
3. Fills in task details: title, notes, due date/time, priority, estimated minutes, difficulty, category
4. Optionally sets recurrence (daily, weekly, monthly, or custom interval)
5. Confirms by clicking "Add"

**Behavior**:
- Task is immediately added to the list
- Appears in relevant views (daily timeline, weekly buckets, capacity calculation)
- If recurring, instances expand across future dates

#### Edit Tasks
**Use Case**: User needs to modify a task they created

**Steps**:
1. User clicks on a task in any view
2. Edit form opens with pre-filled values
3. User modifies desired fields
4. Confirms changes by clicking "Update"

**Behavior**:
- Changes apply immediately
- Affects recurrence instances if applicable
- Capacity calculations update in real-time

#### Complete Tasks
**Use Case**: User marks a task as done

**Steps**:
1. User clicks the checkbox next to a task (in daily or weekly view)
2. Task is marked as completed

**Behavior**:
- Completed tasks show visual indication (strikethrough, opacity change)
- Still count toward capacity (for that day)
- Can be toggled back to incomplete if needed
- Completed tasks remain visible in the list (not hidden)

#### Delete Tasks
**Use Case**: User removes a task from their workload

**Steps**:
1. User opens a task in edit mode
2. Clicks "Delete" button
3. Confirms deletion in modal dialog
4. Task is removed

**Behavior**:
- Task is permanently deleted from memory (until page refresh)
- Recurrence instances are also deleted
- Capacity calculations update
- Deletion is final (no undo)

#### Search Tasks
**Use Case**: User wants to find a specific task

**Steps**:
1. User types in the search box
2. List filters in real-time

**Behavior**:
- Searches across title, notes, category
- Case-insensitive matching
- Shows matches in current view
- Clear search to see all tasks again

### 2. Event Management

#### Create Events
**Use Case**: User schedules a meeting, class, or appointment

**Steps**:
1. User clicks the floating "+" button
2. Selects "Add Event" from the menu
3. Fills in event details: title, notes, date, start time, end time, location, category
4. Optionally sets recurrence
5. Confirms by clicking "Add"

**Behavior**:
- Event appears in timeline and calendar
- Duration is calculated automatically
- Affects capacity calculation
- Overlapping events are displayed together

#### Edit Events
**Use Case**: User modifies an event's details

**Steps**:
1. User clicks on an event in timeline or calendar
2. Edit form opens
3. User modifies fields
4. Confirms changes

**Behavior**:
- Changes update immediately
- Duration automatically recalculated
- Capacity updates in calendar view

#### Delete Events
**Use Case**: User removes a scheduled event

**Steps**:
1. User opens an event in edit mode
2. Clicks "Delete" button
3. Confirms in modal
4. Event is removed

**Behavior**:
- Event deleted permanently
- Affects capacity visualization
- Overlapping tasks/events rearrange in timeline

#### View Recurring Events
**Use Case**: User views all instances of a recurring event

**Example**: "CS 407 Lecture" repeats every Tuesday and Thursday

**Behavior**:
- Each instance appears independently in daily/weekly views
- Edit form shows the original recurrence settings
- Editing the recurrence pattern updates all instances

### 3. Planning Views

#### Daily View (Home)
**Use Case**: User wants to see their day in detail

**Features**:
- Timeline grouped by hour blocks
- All tasks due today with completion checkboxes
- All events today with start/end times
- Day selector to navigate to other days
- Swipe left/right to go to previous/next day
- Color-coded by priority (red=High, yellow=Medium, green=Low)
- Sorted by due time

**Information Displayed**:
- Task title, priority, due time
- Event title, location, time range
- Completion status of tasks
- Estimated minutes for each task

#### Weekly View
**Use Case**: User wants a broad overview of upcoming work

**Features**:
- Grouped task buckets:
  - **Today**: Due today
  - **Tomorrow**: Due tomorrow
  - **This Week**: Due within 7 days
  - **Later**: Due beyond this week
- Collapsible bucket sections
- Swipe left/right to navigate weeks
- Color-coded by priority
- Shows task count per bucket

**Information Displayed**:
- Task title and due date
- Priority indicator
- Completion checkbox
- Search filters across all buckets

#### Monthly View (Calendar)
**Use Case**: User wants to see workload distribution across the month

**Features**:
- Traditional month calendar grid
- Color-coded cells by capacity percentage:
  - Light green: 0-25% capacity
  - Yellow: 25-50% capacity
  - Orange: 50-75% capacity
  - Red: 75%+ capacity
- Swipe left/right to navigate months
- Click cells to see details (future feature)
- Hover/tap to see capacity value

**Information Displayed**:
- Date number
- Capacity percentage/color
- Visual heatmap

### 4. Recurring Items

#### Set Daily Recurrence
**Use Case**: Task or event repeats every single day

**Example**: Daily standup meeting, daily exercise routine

**Configuration**:
- User selects "Daily" in recurrence options
- No additional parameters needed

**Behavior**:
- Item appears on every future date
- Edit affects all instances
- Delete removes all instances

#### Set Weekly Recurrence (Specific Days)
**Use Case**: Task/event repeats on specific days of the week

**Example**: CS 407 Lecture on Tue & Thu, Gym on Mon/Wed/Fri

**Configuration**:
- User selects "Weekly"
- Checks desired weekdays (Sun-Sat)
- Can select multiple days

**Behavior**:
- Item appears only on selected weekdays
- Recurring pattern continues indefinitely
- Edit/delete affects all instances

#### Set Monthly Recurrence
**Use Case**: Task/event repeats on the same date each month

**Example**: Rent due on the 1st, Monthly budget review

**Configuration**:
- User selects "Monthly"
- System automatically sets to repeat on the same date

**Behavior**:
- Item appears on matching date in each month
- Handles edge cases (e.g., Feb 31st becomes Feb 28/29)
- Continues indefinitely

#### Set Custom Interval (Every N Days)
**Use Case**: Task/event repeats at a custom interval

**Example**: Water plants every 3 days, Team sync every 2 weeks (14 days)

**Configuration**:
- User selects "Every N Days"
- Enters the interval number (1-365)
- Starting date is used as the base

**Behavior**:
- Item repeats at the specified interval
- Pattern continues indefinitely
- Edit/delete affects all instances

### 5. Navigation & Interaction

#### Floating Action Menu
**Use Case**: Quick access to create new items

**Features**:
- Floating "+" button in bottom-right
- Opens menu with "Add Task" and "Add Event" options
- Visible on all views
- Easy access without navigation

#### Date Selection
**Use Case**: User switches to a different date or week

**Features**:
- Calendar picker in header
- Swipe gestures (left/right)
- Previous/Next buttons
- Display current date/week/month

**Behavior**:
- Clicking a date updates the view
- Swiping animates transition
- Shows appropriate date range for current view

#### Completion Toggle
**Use Case**: User marks tasks done without opening edit form

**Features**:
- Checkbox directly in list view
- Single click to toggle
- Instant visual feedback
- Applies immediately

#### Search & Filter
**Use Case**: User finds tasks by keyword

**Features**:
- Search box in header (or below nav)
- Real-time filtering as user types
- Searches: title, notes, category
- Case-insensitive
- Shows only matching items

## Data Visualization

### Capacity Heatmap (Monthly View)
- **Purpose**: Visual representation of workload distribution
- **Metric**: Weighted task load + event duration
- **Color Scale**: Green (low) → Yellow → Orange → Red (high)
- **Use Case**: Identify busy/light days at a glance

### Priority Color Coding
- **Red**: High priority (urgent, important)
- **Yellow**: Medium priority (moderate importance)
- **Green**: Low priority (nice-to-have, flexible)
- **Purpose**: Quick visual scanning of importance

### Time Grouping (Daily View)
- **Organization**: Tasks/events grouped by hour blocks
- **Purpose**: Helps visualize daily schedule and available time slots
- **Benefit**: Easier to spot conflicts or gaps

## Use Case Scenarios

### Scenario 1: College Student Planning Their Week

**Goal**: Manage classes, assignments, and personal time

**Steps**:
1. Open PlanAware (Home view shows today)
2. Review today's tasks and events
3. Switch to Weekly view to see upcoming assignments
4. Check Monthly view to identify heavy workload days
5. Add a new assignment using the "+" button
6. Set recurrence for weekly classes
7. Mark completed assignments
8. Search for "exam" to find all exam-related tasks

### Scenario 2: Professional Managing Work & Life

**Goal**: Balance work meetings, projects, and personal activities

**Steps**:
1. Create recurring daily standup meetings
2. Add weekly status update task
3. Block off personal time as recurring "events"
4. Use capacity heatmap to avoid overloading specific days
5. Search for "project X" to focus on one project's tasks
6. Check Monday morning with daily view before week starts
7. Edit recurring tasks if project deadlines shift

### Scenario 3: User Planning a Busy Month

**Goal**: Distribute work evenly across the month

**Steps**:
1. View Monthly calendar to see capacity heatmap
2. Identify red days (75%+ loaded)
3. Move some tasks from red days to green days
4. Add events with proper duration estimates
5. Recalculate capacity visually
6. Balance by spreading work across the month

## Future Feature Ideas

- **Drag & drop** tasks between dates
- **Task templates** for recurring workflows
- **Estimated vs. actual time** tracking
- **Tags** in addition to/instead of categories
- **Subtasks** and checklists
- **Notifications** and reminders
- **Social sharing** of availability
- **Time zone** support for global users
- **Dark mode** theme option
- **Mobile app** with offline sync
- **Calendar integration** (Google Calendar, Outlook)
- **Pomodoro timer** for time blocking
