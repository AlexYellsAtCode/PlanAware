# PlanAware

PlanAware is a Vite + React productivity prototype that combines tasks and calendar events in a mobile-style interface.

The current implementation focuses on planning and workload awareness with:

- Daily task and schedule views
- Weekly grouping and collapsible buckets
- Monthly calendar heatmap by estimated capacity
- A timeline that overlays events and task due-time markers
- Recurring tasks/events (daily, weekly, monthly, every n days, and selected weekdays)
- Local fake API behavior (simulated latency, in-memory CRUD)

## Current App Behavior

### Navigation

- Home: daily timeline, tasks, and schedule for selected day
- Weekly View: grouped "Today / Tomorrow / This Week" lists
- Monthly View: month grid with color-coded capacity levels

### Planning Model

- Tasks support title, notes, due date/time, priority, repetition options, estimated minutes, difficulty, and category.
- Events support title, notes, date, start/end time, location, repetition options, and category.
- Capacity is calculated from:
  - Weighted task load (`estimatedMinutes` adjusted by difficulty)
  - Event duration (start/end time)
  - A fixed daily capacity baseline

### Interaction Highlights

- Create and edit tasks/events from the floating add menu.
- Mark tasks complete directly from the daily list.
- Delete tasks/events from edit mode with a confirmation modal.
- Search filters both tasks and events by key fields.
- Swipe gestures:
  - Home: previous/next day
  - Weekly: previous/next week
  - Monthly: previous/next month

## Tech Stack

- React 18
- Vite 8
- Plain CSS (single stylesheet)
- No external state manager
- No real backend (simulated in `src/App.jsx`)

## Getting Started

### Requirements

- Node.js 18+
- npm

### Install and Run

1. Install dependencies:

	```bash
	npm install
	```

2. Start the development server:

	```bash
	npm run dev
	```

3. Open the local URL shown in the terminal.

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build locally

## Project Structure

```text
.
|- index.html
|- package.json
|- README.md
|- vite.config.js
`- src/
	|- App.jsx
	|- main.jsx
	`- styles.css
```

## Notes and Limitations

- Data is stored in memory only and resets on refresh/restart.
- Backend calls are simulated with delayed promises to mimic network behavior.
- The package name currently remains `functional-prototype`; this does not affect runtime behavior.
