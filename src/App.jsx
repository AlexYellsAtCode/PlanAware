import { useEffect, useMemo, useState, useRef } from 'react'

function shortPriority(priority) {
  if (String(priority).toLowerCase() === 'medium') return 'Med'
  return priority
}

function formatWeekDue(dayOffset, hour24, minute) {
  const today = new Date() 
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const dueDate = new Date(weekStart)
  dueDate.setDate(weekStart.getDate() + dayOffset)

  const period = hour24 >= 12 ? 'PM' : 'AM'
  const hour12 = hour24 % 12 || 12
  const dateLabel = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return `${dateLabel} ${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`
}

const seedTasks = [
  { id: 1, title: 'Review Week Plan', notes: 'Prioritize assignments for the week', completed: false, priority: 'Low', due: formatWeekDue(0, 10, 0), estimatedMinutes: 40, difficulty: 1, category: 'learning' },
  { id: 2, title: 'CS 407 Reading Quiz Prep', notes: 'Read chapter and practice key terms', completed: false, priority: 'Medium', due: formatWeekDue(1, 19, 30), estimatedMinutes: 90, difficulty: 2, category: 'learning' },
  { id: 3, title: 'Data Structures Homework', notes: 'Complete graph traversal problems', completed: false, priority: 'High', due: formatWeekDue(2, 17, 0), estimatedMinutes: 180, difficulty: 5, category: 'work' },
  { id: 4, title: 'Gym Session', notes: '45 minutes cardio + stretching', completed: true, priority: 'Low', due: formatWeekDue(2, 20, 0), estimatedMinutes: 50, difficulty: 2, category: 'health' },
  { id: 5, title: 'Lab Worksheet', notes: 'Finish calculations before Thursday', completed: false, priority: 'Medium', due: formatWeekDue(3, 14, 30), estimatedMinutes: 75, difficulty: 3, category: 'learning' },
  { id: 6, title: 'Group Project Meeting Prep', notes: 'Create talking points and progress notes', completed: false, priority: 'High', due: formatWeekDue(4, 16, 0), estimatedMinutes: 140, difficulty: 4, category: 'work' },
  { id: 7, title: 'Draft Reflection Post', notes: 'Post to class discussion board', completed: false, priority: 'Medium', due: formatWeekDue(4, 21, 0), estimatedMinutes: 55, difficulty: 2, category: 'learning' },
  { id: 8, title: 'Weekly Budget Check', notes: 'Track spending and meal plan', completed: false, priority: 'Low', due: formatWeekDue(5, 12, 0), estimatedMinutes: 35, difficulty: 1, category: 'personal' },
  { id: 9, title: 'CS 466 Project Sprint', notes: 'Implement parser module and write tests', completed: false, priority: 'High', due: formatWeekDue(5, 18, 0), estimatedMinutes: 260, difficulty: 5, category: 'work' },
  { id: 10, title: 'Laundry + Room Reset', notes: 'Prepare for next week', completed: false, priority: 'Medium', due: formatWeekDue(6, 15, 0), estimatedMinutes: 70, difficulty: 2, category: 'personal' },
]

const seedEvents = [
  {
    id: 101,
    title: 'CS 466 Lecture',
    notes: 'Course lecture',
    date: '2026-04-07',
    startHour: '09',
    startMinute: '30',
    startPeriod: 'AM',
    endHour: '10',
    endMinute: '45',
    endPeriod: 'AM',
    location: 'SEC 3437',
    category: 'work',
    repeatType: 'weekly-x',
    repeatWeekDays: [2, 4],
    repeatEveryNDays: 2,
  },
  {
    id: 102,
    title: 'CS 407 Lecture',
    notes: 'Course lecture',
    date: '2026-04-07',
    startHour: '11',
    startMinute: '00',
    startPeriod: 'AM',
    endHour: '12',
    endMinute: '15',
    endPeriod: 'PM',
    location: 'SERC 2036',
    category: 'personal',
    repeatType: 'weekly-x',
    repeatWeekDays: [2, 4],
    repeatEveryNDays: 2,
  },
]

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

let fakeTasks = clone(seedTasks)
let fakeEvents = clone(seedEvents)

const fakeBackend = {
  async listTasks() {
    await wait(650)
    return clone(fakeTasks)
  },
  async addTask(task) {
    await wait(500)
    const nextTask = { ...task, id: Date.now(), completed: false }
    fakeTasks = [nextTask, ...fakeTasks]
    return clone(nextTask)
  },
  async toggleTask(id) {
    await wait(300)
    fakeTasks = fakeTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    return clone(fakeTasks.find((task) => task.id === id))
  },
  async updateTask(id, updates) {
    await wait(450)
    fakeTasks = fakeTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    return clone(fakeTasks.find((task) => task.id === id))
  },
  async deleteTask(id){
    await wait (400)
    fakeTasks = fakeTasks.filter((task) => task.id !== id)
    return id
  },
  async listEvents() {
    await wait(500)
    return clone(fakeEvents)
  },
  async addEvent(event) {
    await wait(450)
    const nextEvent = { ...event, id: Date.now() }
    fakeEvents = [nextEvent, ...fakeEvents]
    return clone(nextEvent)
  },
  async updateEvent(id, updates) {
    await wait(450)
    fakeEvents = fakeEvents.map((event) => (event.id === id ? { ...event, ...updates } : event))
    return clone(fakeEvents.find((event) => event.id === id))
  },
  async deleteEvent(id) {
    await wait(400)
    fakeEvents = fakeEvents.filter((event) => event.id !== id)
    return id
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const DAILY_CAPACITY_MINUTES = (24 - 8 - 3) * 60

function getDifficultyMultiplier(difficulty) {
  const normalizedDifficulty = Number.isFinite(Number(difficulty)) ? Number(difficulty) : 1
  const clampedDifficulty = Math.max(1, Math.min(5, normalizedDifficulty))
  return 1 + (clampedDifficulty - 1) * 0.2
}

function calculateCapacity(tasks) {
  const totalLoadMinutes = tasks.reduce((sum, task) => {
    const taskMinutes = Math.max(0, Number(task.estimatedMinutes) || 0)
    const difficultyMultiplier = getDifficultyMultiplier(task.difficulty)
    const weightedTaskMinutes = taskMinutes * difficultyMultiplier
    return sum + weightedTaskMinutes
  }, 0)

  const capacityPercent = (totalLoadMinutes / DAILY_CAPACITY_MINUTES) * 100
  return Math.min(100, Math.round(capacityPercent))
}

function getEventDurationMinutes(event) {
  const startHour24 = to24Hour(event.startHour, event.startPeriod)
  const endHour24 = to24Hour(event.endHour, event.endPeriod)
  const startMinute = Math.max(0, Math.min(59, Number.parseInt(event.startMinute, 10) || 0))
  const endMinute = Math.max(0, Math.min(59, Number.parseInt(event.endMinute, 10) || 0))

  const startTotalMinutes = startHour24 * 60 + startMinute
  let endTotalMinutes = endHour24 * 60 + endMinute
  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60
  }

  return Math.max(0, endTotalMinutes - startTotalMinutes)
}

function calculateCapacityWithEvents(tasks, events) {
  const taskLoadMinutes = tasks.reduce((sum, task) => {
    const taskMinutes = Math.max(0, Number(task.estimatedMinutes) || 0)
    const difficultyMultiplier = getDifficultyMultiplier(task.difficulty)
    const weightedTaskMinutes = taskMinutes * difficultyMultiplier
    return sum + weightedTaskMinutes
  }, 0)

  const eventLoadMinutes = events.reduce((sum, event) => sum + getEventDurationMinutes(event), 0)
  const totalLoadMinutes = taskLoadMinutes + eventLoadMinutes
  const capacityPercent = (totalLoadMinutes / DAILY_CAPACITY_MINUTES) * 100
  return Math.min(100, Math.round(capacityPercent))
}

function getTaskTimingBucket(task, anchorDate) {
  const dueDate = parseDueDateTime(String(task.due || ''))
  return getRelativeTimingBucket(dueDate, anchorDate)
}

function getRelativeTimingBucket(dateValue, anchorDate) {
  if (Number.isNaN(dateValue.getTime())) return 'this-week'

  const anchorDay = new Date(
    anchorDate.getFullYear(),
    anchorDate.getMonth(),
    anchorDate.getDate()
  )

  const targetDay = new Date(
    dateValue.getFullYear(),
    dateValue.getMonth(),
    dateValue.getDate()
  )

  const millisPerDay = 24 * 60 * 60 * 1000
  const dayDiff = Math.round((targetDay.getTime() - anchorDay.getTime()) / millisPerDay)

  if (dayDiff === 0) return 'today'
  if (dayDiff === 1) return 'tomorrow'
  if (dayDiff >= 2 && dayDiff <= 6) return 'this-week'
  return 'outside-week'
}

function parseDueDateTime(dueString) {
  try {
    const dateTimeRegex = /^(.+?)\s+(\d{1,2}):(\d{2})\s+(AM|PM)$/
    const match = dueString.match(dateTimeRegex)
    if (!match) return new Date(8640000000000000)
    
    const dateStr = match[1]
    const hours = parseInt(match[2], 10)
    const minutes = parseInt(match[3], 10)
    const period = match[4]
    
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return new Date(8640000000000000)
    
    let finalHours = hours
    if (period === 'PM' && hours !== 12) finalHours += 12
    if (period === 'AM' && hours === 12) finalHours = 0
    
    date.setHours(finalHours, minutes, 0, 0)
    return date
  } catch {
    return new Date(8640000000000000)
  }
}

function getPriorityValue(priority) {
  switch (String(priority).toLowerCase()) {
    case 'high':
      return 3
    case 'medium':
      return 2
    case 'low':
      return 1
    default:
      return 0
  }
}

function getCapacityLevel(value) {
  if (value === 0) return 'none'
  if (value <= 40) return 'low'
  if (value <= 70) return 'medium'
  return 'high'
}

function normalizeHourInput(value) {
  const digits = String(value || '').replace(/[^0-9]/g, '').slice(0, 2)
  if (!digits) return '01'

  let hour = Number.parseInt(digits, 10)
  if (!Number.isFinite(hour)) hour = 1
  hour = Math.max(1, Math.min(12, hour))
  return String(hour).padStart(2, '0')
}

function normalizeMinuteInput(value) {
  const digits = String(value || '').replace(/[^0-9]/g, '').slice(0, 2)
  if (!digits) return '00'

  let minute = Number.parseInt(digits, 10)
  if (!Number.isFinite(minute)) minute = 0
  minute = Math.max(0, Math.min(59, minute))
  return String(minute).padStart(2, '0')
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getRelativeDayLabel(date, referenceDate) {
  const current = startOfDay(date)
  const reference = startOfDay(referenceDate)
  const millisPerDay = 24 * 60 * 60 * 1000
  const dayDiff = Math.round((current.getTime() - reference.getTime()) / millisPerDay)

  if (dayDiff === 0) return 'Today'
  if (dayDiff === 1) return 'Tomorrow'
  if (dayDiff === -1) return 'Yesterday'
  if (dayDiff > 1 && dayDiff <= 6) return `In ${dayDiff} days`
  if (dayDiff < -1 && dayDiff >= -6) return `${Math.abs(dayDiff)} days ago`
  return ''
}

function getStartOfWeek(date) {
  const dayStart = startOfDay(date)
  return addDays(dayStart, -dayStart.getDay())
}

const SHORT_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatShortMonthDay(date) {
  return `${SHORT_MONTH_NAMES[date.getMonth()]} ${date.getDate()}`
}

function formatWeekRange(date) {
  const weekStart = getStartOfWeek(date)
  const weekEnd = addDays(weekStart, 6)
  const sameYear = weekStart.getFullYear() === weekEnd.getFullYear()
  const sameMonth = sameYear && weekStart.getMonth() === weekEnd.getMonth()

  if (sameMonth) {
    return `${formatShortMonthDay(weekStart)} - ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`
  }

  if (sameYear) {
    return `${formatShortMonthDay(weekStart)} - ${formatShortMonthDay(weekEnd)}, ${weekEnd.getFullYear()}`
  }

  return `${formatShortMonthDay(weekStart)}, ${weekStart.getFullYear()} - ${formatShortMonthDay(weekEnd)}, ${weekEnd.getFullYear()}`
}

function formatEventTime(event) {
  return `${normalizeHourInput(event.startHour)}:${normalizeMinuteInput(event.startMinute)} ${event.startPeriod} - ${normalizeHourInput(event.endHour)}:${normalizeMinuteInput(event.endMinute)} ${event.endPeriod}`
}

function to24Hour(hourValue, period) {
  const hour = Math.max(1, Math.min(12, Number.parseInt(hourValue, 10) || 12))
  if (period === 'PM' && hour !== 12) return hour + 12
  if (period === 'AM' && hour === 12) return 0
  return hour
}

function toClockLabel(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const WEEKDAY_OPTIONS = [
  { value: 0, label: 'S' },
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' },
]

function normalizeRepeatDays(days) {
  if (!Array.isArray(days)) return []
  return [...new Set(days.map((day) => Number(day)).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))].sort((a, b) => a - b)
}

function getRepeatSummary(item) {
  const repeatType = item.repeatType || 'none'
  if (repeatType === 'daily') return 'Repeats daily'
  if (repeatType === 'weekly') return 'Repeats weekly'
  if (repeatType === 'monthly') return 'Repeats monthly'
  if (repeatType === 'every-n-days') {
    const n = Math.max(1, Number.parseInt(item.repeatEveryNDays, 10) || 1)
    return `Repeats every ${n} day${n === 1 ? '' : 's'}`
  }
  if (repeatType === 'weekly-x') {
    const days = normalizeRepeatDays(item.repeatWeekDays)
    if (!days.length) return 'Repeats weekly (custom days)'
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return `Repeats ${days.map((day) => labels[day]).join(', ')}`
  }
  return ''
}

function occursOnDate(item, anchorDate, targetDate) {
  if (!anchorDate || Number.isNaN(anchorDate.getTime())) return false

  const anchor = startOfDay(anchorDate)
  const target = startOfDay(targetDate)
  const millisPerDay = 24 * 60 * 60 * 1000
  const dayDiff = Math.round((target.getTime() - anchor.getTime()) / millisPerDay)
  const repeatType = item.repeatType || 'none'

  if (repeatType === 'none') return dayDiff === 0
  if (dayDiff < 0) return false

  switch (repeatType) {
    case 'daily':
      return true
    case 'weekly':
      return target.getDay() === anchor.getDay()
    case 'weekly-x': {
      const days = normalizeRepeatDays(item.repeatWeekDays)
      return days.includes(target.getDay())
    }
    case 'monthly':
      return target.getDate() === anchor.getDate()
    case 'every-n-days': {
      const n = Math.max(1, Number.parseInt(item.repeatEveryNDays, 10) || 1)
      return dayDiff % n === 0
    }
    default:
      return dayDiff === 0
  }
}

function App() {
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()))
  const [currentTime, setCurrentTime] = useState(() => new Date())

  const [collapsedBuckets, setCollapsedBuckets] = useState({})

  function toggleBucket(key) {
    setCollapsedBuckets((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const currentDay = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
  })
  const currentDate = selectedDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
  })
  const relativeDayLabel = getRelativeDayLabel(selectedDate, currentTime)

  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date())
    updateClock()
    const timerId = window.setInterval(updateClock, 1000)

    return () => window.clearInterval(timerId)
  }, [])
  
  const getTodayISOString = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getUpcomingHourDefaults = () => {
    const now = new Date()
    const nextHour24 = Math.min(23, now.getHours() + 1)
    const hour12 = nextHour24 % 12 || 12
    const period = nextHour24 >= 12 ? 'PM' : 'AM'

    return {
      dueTimeHour: String(hour12).padStart(2, '0'),
      dueTimeMinute: '00',
      dueTimePeriod: period,
    }
  }
  
  const formatDateForDisplay = (isoDate) => {
    const date = new Date(isoDate + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const createDefaultForm = () => ({
    title: '',
    notes: '',
    priority: 'Medium',
    dueDate: getTodayISOString(),
    ...getUpcomingHourDefaults(),
    estimatedMinutes: '30',
    difficulty: '3',
    category: 'work',
    repeatType: 'none',
    repeatWeekDays: [],
    repeatEveryNDays: '2',
  })

  const createDefaultEventForm = () => ({
    title: '',
    notes: '',
    date: getTodayISOString(),
    category: 'work',
    startHour: '09',
    startMinute: '00',
    startPeriod: 'AM',
    endHour: '10',
    endMinute: '00',
    endPeriod: 'AM',
    location: '',
    repeatType: 'none',
    repeatWeekDays: [],
    repeatEveryNDays: '2',
  })

  const getFormFromEvent = (event) => ({
    title: event.title || '',
    notes: event.notes || '',
    date: event.date || getTodayISOString(),
    category: event.category || 'work',
    startHour: normalizeHourInput(event.startHour),
    startMinute: normalizeMinuteInput(event.startMinute),
    startPeriod: event.startPeriod || 'AM',
    endHour: normalizeHourInput(event.endHour),
    endMinute: normalizeMinuteInput(event.endMinute),
    endPeriod: event.endPeriod || 'AM',
    location: event.location || '',
    repeatType: event.repeatType || 'none',
    repeatWeekDays: normalizeRepeatDays(event.repeatWeekDays),
    repeatEveryNDays: String(event.repeatEveryNDays || '2'),
  })

  const getFormFromTask = (task) => {
    const dueDateTime = parseDueDateTime(task.due)
    const fallbackDate = new Date()
    const safeDate = Number.isNaN(dueDateTime.getTime()) ? fallbackDate : dueDateTime

    const dueDate = `${safeDate.getFullYear()}-${String(safeDate.getMonth() + 1).padStart(2, '0')}-${String(safeDate.getDate()).padStart(2, '0')}`
    const rawHours = safeDate.getHours()
    const dueTimePeriod = rawHours >= 12 ? 'PM' : 'AM'
    const dueTimeHour = String(rawHours % 12 || 12).padStart(2, '0')
    const dueTimeMinute = String(safeDate.getMinutes()).padStart(2, '0')

    return {
      title: task.title || '',
      notes: task.notes || '',
      priority: task.priority || 'Medium',
      dueDate,
      dueTimeHour,
      dueTimeMinute,
      dueTimePeriod,
      estimatedMinutes: String(task.estimatedMinutes ?? '30'),
      difficulty: String(task.difficulty ?? '3'),
      category: task.category || 'work',
      repeatType: task.repeatType || 'none',
      repeatWeekDays: normalizeRepeatDays(task.repeatWeekDays),
      repeatEveryNDays: String(task.repeatEveryNDays || '2'),
    }
  }
  
  const [tasks, setTasks] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [screen, setScreen] = useState('home')
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerMode, setComposerMode] = useState('task')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingEventId, setEditingEventId] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchStartY, setTouchStartY] = useState(null)
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(createDefaultForm)
  const [eventForm, setEventForm] = useState(createDefaultEventForm)

  useEffect(() => {
    let active = true
    Promise.all([fakeBackend.listTasks(), fakeBackend.listEvents()]).then(([taskItems, eventItems]) => {
      if (active) {
        setTasks(taskItems)
        setEvents(eventItems)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const searchedAndSortedTasks = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    const filtered = !normalized ? tasks : tasks.filter((task) =>
      [task.title, task.notes, task.priority, task.due, String(task.estimatedMinutes), String(task.difficulty), getRepeatSummary(task)].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    )
    return filtered.sort((a, b) => {
      if (a.completed === b.completed) {
        const aTime = parseDueDateTime(a.due).getTime()
        const bTime = parseDueDateTime(b.due).getTime()
        if (aTime === bTime) {
          return getPriorityValue(b.priority) - getPriorityValue(a.priority)
        }
        return aTime - bTime
      }
      return a.completed ? 1 : -1
    })
  }, [query, tasks])

  const dailyTasks = useMemo(() => {
    return searchedAndSortedTasks.filter((task) => {
      const anchorDate = parseDueDateTime(task.due)
      return occursOnDate(task, anchorDate, selectedDate)
    })
  }, [searchedAndSortedTasks, selectedDate])

  const filteredEvents = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    const filtered = !normalized
      ? events
      : events.filter((event) =>
          [event.title, event.notes, event.location, event.date, formatEventTime(event), getRepeatSummary(event)].some((value) => String(value || '').toLowerCase().includes(normalized)),
        )

    return filtered.sort((a, b) => {
      if (a.date === b.date) {
        const aTime = `${normalizeHourInput(a.startHour)}:${normalizeMinuteInput(a.startMinute)} ${a.startPeriod}`
        const bTime = `${normalizeHourInput(b.startHour)}:${normalizeMinuteInput(b.startMinute)} ${b.startPeriod}`
        return aTime.localeCompare(bTime)
      }
      return a.date.localeCompare(b.date)
    })
  }, [events, query])

  const dailyEvents = useMemo(() => {
    return filteredEvents.filter((event) => occursOnDate(event, new Date(`${event.date}T00:00:00`), selectedDate))
  }, [filteredEvents, selectedDate])

  const weeklyBuckets = useMemo(() => {
    const buckets = [
      { key: 'Today', tasks: [] },
      { key: 'Tomorrow', tasks: [] },
      { key: 'This Week', tasks: [] },
    ]

    searchedAndSortedTasks.forEach((task) => {
      const bucketName = getTaskTimingBucket(task, selectedDate)
      if (bucketName === 'outside-week') return

      const bucket =
        bucketName === 'tomorrow'
          ? buckets[1]
          : bucketName === 'this-week'
            ? buckets[2]
            : buckets[0]
      bucket.tasks.push(task)
    })

    return buckets
  }, [searchedAndSortedTasks, selectedDate])

  const weeklyEventBuckets = useMemo(() => {
    const buckets = [
      { key: 'Today', events: [] },
      { key: 'Tomorrow', events: [] },
      { key: 'This Week', events: [] },
    ]

    filteredEvents.forEach((event) => {
      const eventDate = new Date(`${event.date}T00:00:00`)
      const bucketName = getRelativeTimingBucket(eventDate, selectedDate)
      if (bucketName === 'outside-week') return

      const bucket =
        bucketName === 'tomorrow'
          ? buckets[1]
          : bucketName === 'this-week'
            ? buckets[2]
            : buckets[0]
      bucket.events.push(event)
    })

    return buckets
  }, [filteredEvents, selectedDate])

  const timeline = useMemo(() => {
    const intervalMinutes = 15
    const totalMinutes = 24 * 60
    const tickCount = totalMinutes / intervalMinutes
    const today = startOfDay(currentTime)
  
    const windowStart = new Date(selectedDate)
    windowStart.setHours(0, 0, 0, 0)
  
    const windowEnd = new Date(selectedDate)
    windowEnd.setHours(23, 59, 59, 999)
  
    const currentTimePercent = isSameDay(selectedDate, today)
      ? ((currentTime.getHours() * 60 + currentTime.getMinutes()) / totalMinutes) * 100
      : null
  
    const eventBars = dailyEvents
      .map((event) => {
        const startDate = new Date(selectedDate)
        const endDate = new Date(selectedDate)
  
        const startHour24 = to24Hour(event.startHour, event.startPeriod)
        const endHour24 = to24Hour(event.endHour, event.endPeriod)
        const startMinute = Math.max(0, Math.min(59, Number.parseInt(event.startMinute, 10) || 0))
        const endMinute = Math.max(0, Math.min(59, Number.parseInt(event.endMinute, 10) || 0))
  
        startDate.setHours(startHour24, startMinute, 0, 0)
        endDate.setHours(endHour24, endMinute, 0, 0)
  
        if (endDate <= startDate) {
          endDate.setDate(endDate.getDate() + 1)
        }
  
        const offsetMinutes = (startDate.getTime() - windowStart.getTime()) / (60 * 1000)
        const durationMinutes = (endDate.getTime() - startDate.getTime()) / (60 * 1000)
  
        return {
          id: `event-timeline-${event.id}`,
          title: event.title,
          category: event.category || 'work',
          leftPercent: (offsetMinutes / totalMinutes) * 100,
          widthPercent: Math.max(0.4, (durationMinutes / totalMinutes) * 100),
        }
      })
      .filter(Boolean)
  
    const taskDots = dailyTasks
      .map((task) => {
        const anchorDate = parseDueDateTime(task.due)
        if (Number.isNaN(anchorDate.getTime())) return null
  
        const dueDate = new Date(selectedDate)
        dueDate.setHours(anchorDate.getHours(), anchorDate.getMinutes(), 0, 0)
  
        const offsetMinutes = (dueDate.getTime() - windowStart.getTime()) / (60 * 1000)
        return {
          id: `task-timeline-${task.id}`,
          title: task.title,
          category: task.category || 'work',
          leftPercent: (offsetMinutes / totalMinutes) * 100,
        }
      })
      .filter(Boolean)
  
    const ticks = Array.from({ length: tickCount + 1 }, (_, index) => ({
      id: `tick-${index}`,
      leftPercent: (index / tickCount) * 100,
      isHourMark: index % 4 === 0,
      hourLabel: index % 4 === 0 ? (() => {
        const h = Math.floor((index * intervalMinutes) / 60)
        const period = h >= 12 ? 'PM' : 'AM'
        const h12 = h % 12 || 12
        return `${h12}${period}`
      })() : null,
    }))
  
    return {
      startLabel: '12 AM',
      endLabel: '11 PM',
      ticks,
      eventBars,
      taskDots,
      currentTimePercent,
    }
  }, [currentTime, dailyEvents, dailyTasks, selectedDate])

  const capacity = useMemo(() => {
    const selectedDayTasks = tasks.filter((task) => {
      const anchorDate = parseDueDateTime(task.due)
      return occursOnDate(task, anchorDate, selectedDate)
    })

    const selectedDayEvents = events.filter((event) => occursOnDate(event, new Date(`${event.date}T00:00:00`), selectedDate))
    return calculateCapacityWithEvents(selectedDayTasks, selectedDayEvents)
  }, [tasks, events, selectedDate])
  const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const weeklyCapacity = useMemo(() => {
    const weekStart = getStartOfWeek(selectedDate)
    const tasksByDay = Array.from({ length: 7 }, () => [])
    const eventsByDay = Array.from({ length: 7 }, () => [])

    tasks.forEach((task) => {
      const anchorDate = parseDueDateTime(task.due)
      if (Number.isNaN(anchorDate.getTime())) return

      for (let index = 0; index < 7; index += 1) {
        const dayDate = addDays(weekStart, index)
        if (occursOnDate(task, anchorDate, dayDate)) {
          tasksByDay[index].push(task)
        }
      }
    })

    events.forEach((event) => {
      const anchorDate = new Date(`${event.date}T00:00:00`)
      if (Number.isNaN(anchorDate.getTime())) return

      for (let index = 0; index < 7; index += 1) {
        const dayDate = addDays(weekStart, index)
        if (occursOnDate(event, anchorDate, dayDate)) {
          eventsByDay[index].push(event)
        }
      }
    })

    return weekDayLabels.map((label, index) => {
      const dayDate = addDays(weekStart, index)
      return {
        label,
        value: calculateCapacityWithEvents(tasksByDay[index], eventsByDay[index]),
        isToday: isSameDay(dayDate, selectedDate),
      }
    })
  }, [tasks, events, selectedDate])

  const weeklyRangeLabel = useMemo(() => formatWeekRange(selectedDate), [selectedDate])
  const isViewingCurrentWeek = useMemo(() => {
    const selectedWeekStart = getStartOfWeek(selectedDate)
    const currentWeekStart = getStartOfWeek(new Date())
    return isSameDay(selectedWeekStart, currentWeekStart)
  }, [selectedDate])
  const weeklyHeaderLabel = isViewingCurrentWeek ? `${weeklyRangeLabel} (Current)` : weeklyRangeLabel

  const timelineScrollRef = useRef(null)

  useEffect(() => {
    const el = timelineScrollRef.current
    if (!el || timeline.currentTimePercent === null) return
    const TRACK_WIDTH = 1440
    const scrollTarget = (timeline.currentTimePercent / 100) * TRACK_WIDTH - el.clientWidth / 2
    el.scrollLeft = Math.max(0, scrollTarget)
  }, [timeline.currentTimePercent, selectedDate, screen])
  
  useEffect(() => {
    const el = timelineScrollRef.current
    if (!el) return
  
    let isDragging = false
    let startX = 0
    let startScrollLeft = 0
  
    function onPointerDown(e) {
      isDragging = true
      startX = e.clientX
      startScrollLeft = el.scrollLeft
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
      e.preventDefault()
    }
  
    function onPointerMove(e) {
      if (!isDragging) return
      const delta = e.clientX - startX
      el.scrollLeft = startScrollLeft - delta
    }
  
    function onPointerUp() {
      isDragging = false
      el.style.cursor = ''
    }
  
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
  
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
    }
  }, [screen])

  function shiftSelectedDate(days) {
    setSelectedDate((current) => startOfDay(addDays(current, days)))
  }

  function handleTouchStart(event) {
    if (screen !== 'home' && screen !== 'weekly') return
    const touch = event.touches[0]
    setTouchStartX(touch.clientX)
    setTouchStartY(touch.clientY)
  }

  function handleTouchEnd(event) {
    if ((screen !== 'home' && screen !== 'weekly') || touchStartX === null || touchStartY === null) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartX
    const deltaY = touch.clientY - touchStartY
    const horizontalThreshold = 50

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= horizontalThreshold) {
      const dayShift = screen === 'weekly' ? 7 : 1
      shiftSelectedDate(deltaX < 0 ? dayShift : -dayShift)
    }

    setTouchStartX(null)
    setTouchStartY(null)
  }

  /* ----------------------------------------------------Helper functions for monthly calender view---------------------------------------------------*/

  const [visibleMonth, setVisibleMonth] = useState(new Date())

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  function getMonthName(date) {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }



  function goToPreviousMonth() {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
  }

  function goToNextMonth() {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
  }

  const monthlyCalendarCells = useMemo(() => {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const realDayCells = Array.from({ length: daysInMonth }, (_, index) => {
      const dayNumber = index + 1
      const dayDate = new Date(year, month, dayNumber)

      const dayTasks = []
      const dayEvents = []

      tasks.forEach((task) => {
        const anchorDate = parseDueDateTime(task.due)
        if (Number.isNaN(anchorDate.getTime())) return

        if (occursOnDate(task, anchorDate, dayDate)) {
          dayTasks.push(task)
        }
      })

      events.forEach((event) => {
        const anchorDate = new Date(`${event.date}T00:00:00`)
        if (Number.isNaN(anchorDate.getTime())) return

        if (occursOnDate(event, anchorDate, dayDate)) {
          dayEvents.push(event)
        }
      })

      return {
        dayNumber,
        date: dayDate,
        value: calculateCapacityWithEvents(dayTasks, dayEvents),
        isToday: isSameDay(dayDate, new Date()),
        isSelected: isSameDay(dayDate, selectedDate),
      }
    })

    const paddedCells = [
      ...Array(firstDay).fill(null),
      ...realDayCells,
    ]

    while (paddedCells.length % 7 !== 0) {
      paddedCells.push(null)
    }

    return paddedCells
  }, [tasks, events, visibleMonth, selectedDate])

/* --------------------------------------------------------------------------------------------------------------*/

  function openNewTaskComposer() {
    setAddMenuOpen(false)
    setComposerMode('task')
    setEditingTaskId(null)
    setEditingEventId(null)
    setForm(createDefaultForm())
    setCategoryDropdownOpen(false)
    setComposerOpen(true)
  }

  function openNewEventComposer() {
    setAddMenuOpen(false)
    setComposerMode('event')
    setEditingTaskId(null)
    setEditingEventId(null)
    setEventForm(createDefaultEventForm())
    setCategoryDropdownOpen(false)
    setComposerOpen(true)
  }

  function openTaskEditor(task) {
    setAddMenuOpen(false)
    setComposerMode('task')
    setEditingTaskId(task.id)
    setEditingEventId(null)
    setForm(getFormFromTask(task))
    setCategoryDropdownOpen(false)
    setComposerOpen(true)
  }

  function openEventEditor(event) {
    setAddMenuOpen(false)
    setComposerMode('event')
    setEditingTaskId(null)
    setEditingEventId(event.id)
    setEventForm(getFormFromEvent(event))
    setCategoryDropdownOpen(false)
    setComposerOpen(true)
  }

  function closeComposer() {
    setComposerOpen(false)
    setComposerMode('task')
    setEditingTaskId(null)
    setEditingEventId(null)
    setCategoryDropdownOpen(false)
  }

  function toggleAddMenu() {
    setAddMenuOpen((current) => !current)
  }

  function toggleTaskRepeatDay(dayValue) {
    setForm((current) => {
      const days = normalizeRepeatDays(current.repeatWeekDays)
      const nextDays = days.includes(dayValue) ? days.filter((day) => day !== dayValue) : [...days, dayValue]
      return { ...current, repeatWeekDays: normalizeRepeatDays(nextDays) }
    })
  }

  function toggleEventRepeatDay(dayValue) {
    setEventForm((current) => {
      const days = normalizeRepeatDays(current.repeatWeekDays)
      const nextDays = days.includes(dayValue) ? days.filter((day) => day !== dayValue) : [...days, dayValue]
      return { ...current, repeatWeekDays: normalizeRepeatDays(nextDays) }
    })
  }

  function handleCancelDelete(){
    setDeleteConfirmOpen(false)
  }

  async function handleSaveTask(event) {
    event.preventDefault()
    if (!form.title.trim()) return
    setSyncing(true)
    const displayDate = formatDateForDisplay(form.dueDate)
    const normalizedHour = normalizeHourInput(form.dueTimeHour)
    const normalizedMinute = normalizeMinuteInput(form.dueTimeMinute)
    const dueTime = `${normalizedHour}:${normalizedMinute} ${form.dueTimePeriod}`
    const due = `${displayDate} ${dueTime}`
    const payload = {
      title: form.title.trim(),
      notes: form.notes.trim() || 'No notes added',
      priority: form.priority,
      due: due,
      estimatedMinutes: Number(form.estimatedMinutes),
      difficulty: Number(form.difficulty),
      category: form.category,
      repeatType: form.repeatType,
      repeatWeekDays: normalizeRepeatDays(form.repeatWeekDays),
      repeatEveryNDays: Math.max(1, Number.parseInt(form.repeatEveryNDays, 10) || 1),
    }

    if (editingTaskId !== null) {
      const updated = await fakeBackend.updateTask(editingTaskId, payload)
      setTasks((current) => current.map((task) => (task.id === editingTaskId ? updated : task)))
    } else {
      const added = await fakeBackend.addTask(payload)
      setTasks((current) => [added, ...current])
    }

    setForm(createDefaultForm())
    setSyncing(false)
    closeComposer()
  }

  async function handleConfirmDeleteTask(){
    if (editingTaskId === null) return

    setSyncing(true)

    await fakeBackend.deleteTask(editingTaskId)

    setTasks((current) =>
      current.filter((task) => task.id !== editingTaskId)
    )
    
    setDeleteConfirmOpen(false)
    setForm(createDefaultForm())
    setSyncing(false)
    closeComposer()
  }

  async function handleSaveEvent(event) {
    event.preventDefault()
    if (!eventForm.title.trim()) return

    setSyncing(true)
    const payload = {
      title: eventForm.title.trim(),
      notes: eventForm.notes.trim() || 'No notes added',
      date: eventForm.date,
      category: eventForm.category,
      startHour: normalizeHourInput(eventForm.startHour),
      startMinute: normalizeMinuteInput(eventForm.startMinute),
      startPeriod: eventForm.startPeriod,
      endHour: normalizeHourInput(eventForm.endHour),
      endMinute: normalizeMinuteInput(eventForm.endMinute),
      endPeriod: eventForm.endPeriod,
      location: eventForm.location.trim() || 'No location',
      repeatType: eventForm.repeatType,
      repeatWeekDays: normalizeRepeatDays(eventForm.repeatWeekDays),
      repeatEveryNDays: Math.max(1, Number.parseInt(eventForm.repeatEveryNDays, 10) || 1),
    }

    if (editingEventId !== null) {
      const updated = await fakeBackend.updateEvent(editingEventId, payload)
      setEvents((current) => current.map((eventItem) => (eventItem.id === editingEventId ? updated : eventItem)))
    } else {
      const added = await fakeBackend.addEvent(payload)
      setEvents((current) => [added, ...current])
    }

    setEventForm(createDefaultEventForm())
    setSyncing(false)
    closeComposer()
  }

  async function handleConfirmDeleteEvent(){
    if (editingEventId === null) return

    setSyncing(true)

    await fakeBackend.deleteEvent(editingEventId)

    setEvents((current) =>
      current.filter((event) => event.id !== editingEventId)
    )
    
    setDeleteConfirmOpen(false)
    setForm(createDefaultForm())
    setSyncing(false)
    closeComposer()
  }

  async function handleToggleTask(id) {
    setSyncing(true)
    await fakeBackend.toggleTask(id)
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    setSyncing(false)
  }

  return (
    <main className="page-shell">
      <div className="phone-frame">
        <header className="status-bar">
          <span>{toClockLabel(currentTime)}</span>
          <div className="status-icons" aria-hidden="true">
            <span className="cell-icon">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="battery-wrap">
              <span className="battery-icon" />
              <span className="battery-text">100%</span>
            </span>
          </div>
        </header>

        <section className="app-card">
          <div className="screen-shell">
              <div className="hero">
              <div className="hero-row">
                <div className="date-pill">
                  <span>{currentDay}</span>
                  <strong>{currentDate}</strong>
                  {relativeDayLabel ? <span className="date-pill-relative">{relativeDayLabel}</span> : null}
                </div>
                <div className="hero-stats">
                  <div className="capacity-pill">
                    <div className="capacity-chart" aria-label="Weekly capacity chart">
                      {weeklyCapacity.map((day, index) => (
                        <div key={`capacity-day-${index}-${day.label}`} className="capacity-day">
                          <div className="capacity-bar-track">
                            <div
                              className={`capacity-bar-fill level-${getCapacityLevel(day.value)}${day.isToday ? ' today' : ''}`}
                              style={{ height: `${day.value}%` }}
                            />
                          </div>
                          <span className={`capacity-day-label level-${getCapacityLevel(day.value)}${day.isToday ? ' today' : ''}`}>{day.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="capacity-summary">
                      <span>Capacity</span>
                      <strong className={`capacity-value level-${getCapacityLevel(capacity)}`}>{capacity}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {screen === 'home' && (
              <>
              <section className="timeline-section" aria-label="Full day timeline">
                <div className="timeline-scroll-wrapper" ref={timelineScrollRef}>
                  <div className="timeline-inner">
                    {timeline.currentTimePercent !== null && (
                      <span
                        className="timeline-now-line"
                        style={{ left: `${timeline.currentTimePercent}%` }}
                        aria-hidden="true"
                      />
                    )}
                    <div className="timeline-label-row">
                      {timeline.ticks.filter((t) => t.isHourMark).map((tick) => (
                        <span
                          key={`label-${tick.id}`}
                          className="timeline-hour-label"
                          style={{ left: `${tick.leftPercent}%` }}
                        >
                          {tick.hourLabel}
                        </span>
                      ))}
                    </div>
                    <div className="timeline-track">
                      {timeline.ticks.map((tick) => (
                        <span
                          key={tick.id}
                          className={tick.isHourMark ? 'timeline-tick hour' : 'timeline-tick quarter'}
                          style={{ left: `${tick.leftPercent}%` }}
                          aria-hidden="true"
                        />
                      ))}
                      {timeline.eventBars.map((eventBar) => (
                        <span
                          key={eventBar.id}
                          className={`timeline-event-bar category-${eventBar.category}`}
                          style={{ left: `${eventBar.leftPercent}%`, width: `${eventBar.widthPercent}%` }}
                          title={eventBar.title}
                          aria-label={eventBar.title}
                        />
                      ))}
                      {timeline.taskDots.map((taskDot) => (
                        <span
                          key={taskDot.id}
                          className={`timeline-task-dot category-${taskDot.category}`}
                          style={{ left: `${taskDot.leftPercent}%` }}
                          title={taskDot.title}
                          aria-label={taskDot.title}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                </section>

                <div className="search-row">
                  <div className="search-bar" aria-label="Search tasks">
                    <input
                      className="search-input"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      aria-label="Search tasks"
                      placeholder="Search"
                    />
                  </div>
                  <div className="search-tools-pill" aria-label="Search controls">
                    <button type="button" className="search-icon-btn" aria-label="Filter tasks" title="Filter">
                      <svg className="search-icon-symbol" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" fill="currentColor" />
                      </svg>
                    </button>
                    <button type="button" className="search-icon-btn" aria-label="Sort tasks" title="Sort">
                      ⇅
                    </button>
                  </div>
                </div>

                <section className="task-section home-section" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div className="section-heading">
                  <h2>To-Do List</h2>
                  <span>{loading ? 'Loading…' : `${dailyTasks.length} items`}</span>
                </div>

                <div className="task-list">
                  {loading ? (
                    <div className="empty-state">Loading your tasks from the fake API…</div>
                  ) : dailyTasks.length ? (
                    dailyTasks.map((task) => (
                      <article
                        key={task.id}
                        className={`task-item editable ${task.completed ? 'completed' : ''} category-${task.category || 'work'}`}
                        onClick={() => openTaskEditor(task)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            openTaskEditor(task)
                          }
                        }}
                        aria-label={`Edit ${task.title}`}
                      >
                        <button
                          className="checkbox"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleToggleTask(task.id)
                          }}
                          aria-label={`Mark ${task.title} complete`}
                        >
                          {task.completed ? '✓' : ''}
                        </button>
                        <div className="task-copy">
                          <div className="task-topline">
                            <h3>{task.title}</h3>
                            <span className={`priority priority-${task.priority.toLowerCase()}`}>{shortPriority(task.priority)}</span>                          </div>
                          <p>{task.notes}</p>
                          <div className="task-meta-line">{task.due}</div>
                          {getRepeatSummary(task) ? <div className="task-meta-line">{getRepeatSummary(task)}</div> : null}
                          <div className="task-meta-line">{task.estimatedMinutes} min · Diff {task.difficulty}/5</div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="empty-state">No tasks due today match your search.</div>
                  )}
                </div>

                <div className="section-heading schedule-heading">
                  <h2>Schedule</h2>
                  <span>{loading ? 'Loading…' : `${dailyEvents.length} events`}</span>
                </div>

                <div className="event-list">
                  {loading ? (
                    <div className="empty-state">Loading your events…</div>
                  ) : dailyEvents.length ? (
                    dailyEvents.map((event) => (
                      <article
                        key={event.id}
                        className={`event-item editable category-${event.category || 'work'}`}
                        onClick={() => openEventEditor(event)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(eventKey) => {
                          if (eventKey.key === 'Enter' || eventKey.key === ' ') {
                            eventKey.preventDefault()
                            openEventEditor(event)
                          }
                        }}
                        aria-label={`Edit ${event.title}`}
                      >
                        <div className="event-time">{formatEventTime(event)}</div>
                        <div className="event-copy">
                          <h3>{event.title}</h3>
                          <p>{event.location}</p>
                          {getRepeatSummary(event) ? <p>{getRepeatSummary(event)}</p> : null}
                          <p>{event.notes}</p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="empty-state">No events scheduled for this day.</div>
                  )}
                </div>
              </section>
              </>
            )}

            {screen === 'weekly' && (
              <section className="task-section weekly-section" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div className="section-heading">
                  <h2>Weekly View</h2>
                  <span>{loading ? 'Loading…' : weeklyHeaderLabel}</span>
                </div>

                <div className="weekly-list">
                  {loading ? (
                    <div className="empty-state">Loading weekly tasks…</div>
                  ) : weeklyBuckets.some((bucket) => bucket.tasks.length) ? (
                    weeklyBuckets.map((bucket) => {
                      const eventBucket = weeklyEventBuckets.find((entry) => entry.key === bucket.key)
                      const isCollapsed = collapsedBuckets[bucket.key]
                      const totalItems = bucket.tasks.length + (eventBucket?.events.length || 0)
                      return (
                        <article key={bucket.key} className="weekly-card">
                          <button
                            type="button"
                            className="weekly-card-head"
                            onClick={() => toggleBucket(bucket.key)}
                            aria-expanded={!isCollapsed}
                          >
                            <h3>{bucket.key}</h3>
                            <div className="weekly-card-head-right">
                              <span>{loading ? 'Loading…' : `${totalItems} items`}</span>
                              <span className={`weekly-chevron ${isCollapsed ? 'collapsed' : ''}`}>▾</span>
                            </div>
                          </button>
                          {!isCollapsed && (
                            <div className="weekly-items">
                              {eventBucket?.events.length ? (
                                eventBucket.events.map((event) => (
                                  <div
                                    key={`event-${event.id}`}
                                    className={`weekly-event editable category-${event.category || 'work'}`}
                                    onClick={() => openEventEditor(event)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(eventKey) => {
                                      if (eventKey.key === 'Enter' || eventKey.key === ' ') {
                                        eventKey.preventDefault()
                                        openEventEditor(event)
                                      }
                                    }}
                                    aria-label={`Edit ${event.title}`}
                                  >
                                    <div style={{ width: '100%' }}>
                                      <div className="task-topline">
                                        <strong>{event.title}</strong>
                                      </div>
                                      <p>{formatDateForDisplay(event.date)}</p>
                                      {getRepeatSummary(event) ? <p>{getRepeatSummary(event)}</p> : null}
                                      <p>{formatEventTime(event)} · {event.location}</p>
                                    </div>
                                  </div>
                                ))
                              ) : null}
                    
                              {bucket.tasks.length ? (
                                bucket.tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className={`weekly-task editable ${task.completed ? 'completed' : ''} category-${task.category || 'work'}`}
                                    onClick={() => openTaskEditor(task)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                      if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault()
                                        openTaskEditor(task)
                                      }
                                    }}
                                    aria-label={`Edit ${task.title}`}
                                  >
                                    <div style={{ width: '100%' }}>
                                      <div className="task-topline">
                                        <strong>{task.title}</strong>
                                        <span className={`priority priority-${task.priority.toLowerCase()}`}>{shortPriority(task.priority)}</span>
                                      </div>
                                      <p>{task.due}</p>
                                      {getRepeatSummary(task) ? <p>{getRepeatSummary(task)}</p> : null}
                                      <p>{task.estimatedMinutes} min · Diff {task.difficulty}/5</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="weekly-empty">Nothing scheduled.</p>
                              )}
                            </div>
                          )}
                        </article>
                      )
                    })
                  ) : (
                    <div className="empty-state">No tasks match the current search.</div>
                  )}
                </div>
              </section>
            )}

            {screen === 'monthly' && (
              <section className="task-section monthly-section">
                <div className="section-heading">
                  <h2>Monthly View</h2>
                  <span>{getMonthName(visibleMonth)}</span>
                </div>

                <div className="month-header">
                  <button type="button" className="month-nav-btn" onClick={goToPreviousMonth}>
                    ←
                  </button>
                  <h3>{getMonthName(visibleMonth)}</h3>
                  <button type="button" className="month-nav-btn" onClick={goToNextMonth}>
                    →
                  </button>
                </div>

                <div className="weekday-row">
                  {weekdayLabels.map((day) => (
                    <div key={day} className="weekday-cell">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="month-grid">
                  {monthlyCalendarCells.map((cell, index) => {
                    if (cell === null) {
                      return <div key={index} className="month-cell empty" />
                    }

                    let cellClass = `month-cell level-${getCapacityLevel(cell.value)}`
                    if (cell.isToday) {
                      cellClass += ' today'
                    }

                    return (
                      <button
                        key={index}
                        type="button"
                        className={cellClass}
                        onClick={() => {
                          setSelectedDate(cell.date)
                          setScreen('home')
                        }}
                      >
                        {cell.dayNumber}
                      </button>
                    )
                  })}
                </div>
            </section>
          )}

          </div>
          
          {deleteConfirmOpen && (
            <div className="delete-modal-backdrop" onClick={handleCancelDelete}>
              <div
                className="delete-modal"
                onClick={(event) => event.stopPropagation()}
              >
                <h3 className="delete-modal-title">Delete task?</h3>
                <p className="delete-modal-text">
                  Delete cannot be undone.
                </p>

                <div className="delete-modal-actions">
                  <button
                    type="button"
                    className="delete-cancel-btn"
                    onClick={handleCancelDelete}
                    disabled={syncing}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="delete-confirm-btn"
                    onClick={
                      composerMode === 'task'
                      ? handleConfirmDeleteTask
                      : handleConfirmDeleteEvent
                    }
                    disabled={syncing}
                  >
                    {syncing ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {addMenuOpen ? (
            <div className="add-action-menu" role="menu" aria-label="Create item">
              <button type="button" className="add-action-pill" onClick={openNewTaskComposer} role="menuitem">
                New Task
              </button>
              <button type="button" className="add-action-pill" onClick={openNewEventComposer} role="menuitem">
                New Event
              </button>
            </div>
          ) : null}

          <button className={`floating-add${addMenuOpen ? ' is-active' : ''}`} onClick={toggleAddMenu} aria-label="Create new item" aria-expanded={addMenuOpen}>
            <span className="floating-add-icon">+</span>
          </button>
          {composerOpen ? (
            <div className="composer-backdrop" onClick={closeComposer}>
              <form className="composer-sheet" onSubmit={composerMode === 'task' ? handleSaveTask : handleSaveEvent} onClick={(event) => event.stopPropagation()}>
                <div className="composer-topline">
                  <div>
                    <p className="eyebrow">
                      {composerMode === 'event' ? (editingEventId !== null ? 'Edit event' : 'New event') : editingTaskId !== null ? 'Edit task' : 'New task'}
                    </p>
                  </div>
                  <button type="button" className="sheet-close" onClick={closeComposer}>
                    <span className="sheet-close-icon">×</span>
                  </button>
                </div>
                {composerMode === 'task' ? (
                <div className="compose-grid task-compose-grid">
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Task Name"
                    className="compose-full"
                  />
                  <label className="compose-field">
                    <span className="compose-label">Due Date</span>
                    <input type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} />
                  </label>
                  <div className="compose-field">
                    <span className="compose-label">Category</span>
                    <div className="category-dropdown-wrapper">
                      <button
                        type="button"
                        className={`category-pill category-${form.category}`}
                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        aria-haspopup="listbox"
                        aria-expanded={categoryDropdownOpen}
                      >
                        <span className="category-color-dot" />
                      </button>
                      {categoryDropdownOpen && (
                        <div className="category-dropdown-menu">
                          {['work', 'personal', 'health', 'learning'].map((cat) => (
                            <button
                              key={`cat-${cat}`}
                              type="button"
                              className={`category-dropdown-option category-${cat}`}
                              onClick={() => {
                                setForm((current) => ({ ...current, category: cat }))
                                setCategoryDropdownOpen(false)
                              }}
                              role="option"
                              aria-selected={form.category === cat}
                            >
                              <span className="dropdown-color-dot" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="compose-field compose-full">
                    <span className="compose-label">Due Time</span>
                    <div className="time-picker">
                      <input
                        type="text"
                        value={form.dueTimeHour}
                        onChange={(event) => {
                          const val = event.target.value.replace(/[^0-9]/g, '').slice(0, 2)
                          setForm((current) => ({ ...current, dueTimeHour: val }))
                        }}
                        onBlur={() => {
                          setForm((current) => ({ ...current, dueTimeHour: normalizeHourInput(current.dueTimeHour) }))
                        }}
                        placeholder="HH"
                        maxLength="2"
                        inputMode="numeric"
                        className="time-input"
                      />
                      <span className="time-separator">:</span>
                      <input
                        type="text"
                        value={form.dueTimeMinute}
                        onChange={(event) => {
                          const val = event.target.value.replace(/[^0-9]/g, '').slice(0, 2)
                          setForm((current) => ({ ...current, dueTimeMinute: val }))
                        }}
                        onBlur={() => {
                          setForm((current) => ({ ...current, dueTimeMinute: normalizeMinuteInput(current.dueTimeMinute) }))
                        }}
                        placeholder="MM"
                        maxLength="2"
                        inputMode="numeric"
                        className="time-input"
                      />
                      <select value={form.dueTimePeriod} onChange={(event) => setForm((current) => ({ ...current, dueTimePeriod: event.target.value }))}>
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </label>
                  <label className="compose-field compose-full">
                    <span className="compose-label">Repeat</span>
                    <select value={form.repeatType} onChange={(event) => setForm((current) => ({ ...current, repeatType: event.target.value }))}>
                      <option value="none">Does not repeat</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="weekly-x">Every week on selected days</option>
                      <option value="monthly">Monthly</option>
                      <option value="every-n-days">Every n days</option>
                    </select>
                  </label>
                  {form.repeatType === 'weekly-x' ? (
                    <div className="compose-field compose-full">
                      <span className="compose-label">Repeat Days</span>
                      <div className="repeat-days-row" role="group" aria-label="Repeat days">
                        {WEEKDAY_OPTIONS.map((day) => {
                          const isSelected = normalizeRepeatDays(form.repeatWeekDays).includes(day.value)
                          return (
                            <button
                              key={`task-repeat-day-${day.value}`}
                              type="button"
                              className={isSelected ? 'repeat-day-btn active' : 'repeat-day-btn'}
                              onClick={() => toggleTaskRepeatDay(day.value)}
                            >
                              {day.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}
                  {form.repeatType === 'every-n-days' ? (
                    <label className="compose-field compose-full">
                      <span className="compose-label">Repeat Every (days)</span>
                      <input
                        value={form.repeatEveryNDays}
                        onChange={(event) => setForm((current) => ({ ...current, repeatEveryNDays: event.target.value.replace(/[^0-9]/g, '').slice(0, 3) }))}
                        onBlur={() => setForm((current) => ({ ...current, repeatEveryNDays: String(Math.max(1, Number.parseInt(current.repeatEveryNDays, 10) || 1)) }))}
                        inputMode="numeric"
                        placeholder="e.g. 3"
                      />
                    </label>
                  ) : null}
                  <label className="compose-field compose-full">
                    <span className="compose-label">Time to Complete (minutes)</span>
                    <input
                      value={form.estimatedMinutes}
                      onChange={(event) => setForm((current) => ({ ...current, estimatedMinutes: event.target.value }))}
                      placeholder="Time to Complete (minutes)"
                      inputMode="numeric"
                    />
                  </label>
                  <label className="compose-field priority-field">
                    <span className="compose-label">Priority</span>
                    <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </label>
                  <div className="compose-field difficulty-field">
                    <span className="compose-label">Difficulty</span>
                    <div className="difficulty-pill" role="radiogroup" aria-label="Difficulty">
                      {[1, 2, 3, 4, 5].map((level) => {
                        const isActive = Number(form.difficulty) === level
                        return (
                          <button
                            key={`difficulty-${level}`}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            className={isActive ? 'difficulty-section active' : 'difficulty-section'}
                            onClick={() => setForm((current) => ({ ...current, difficulty: String(level) }))}
                          >
                            {level}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <textarea
                    value={form.notes}
                    onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                    placeholder="Notes"
                    className="compose-full compose-notes"
                  />
                </div>
                ) : (
                  <div className="compose-grid event-compose-grid">
                    <input
                      value={eventForm.title}
                      onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="Event Name"
                      className="compose-full"
                    />
                    <label className="compose-field">
                      <span className="compose-label">Event Date</span>
                      <input type="date" value={eventForm.date} onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))} />
                    </label>
                    <div className="compose-field">
                      <span className="compose-label">Category</span>
                      <div className="category-dropdown-wrapper">
                        <button
                          type="button"
                          className={`category-pill category-${eventForm.category}`}
                          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                          aria-haspopup="listbox"
                          aria-expanded={categoryDropdownOpen}
                        >
                          <span className="category-color-dot" />
                        </button>
                        {categoryDropdownOpen && (
                          <div className="category-dropdown-menu">
                            {['work', 'personal', 'health', 'learning'].map((cat) => (
                              <button
                                key={`event-cat-${cat}`}
                                type="button"
                                className={`category-dropdown-option category-${cat}`}
                                onClick={() => {
                                  setEventForm((current) => ({ ...current, category: cat }))
                                  setCategoryDropdownOpen(false)
                                }}
                                role="option"
                                aria-selected={eventForm.category === cat}
                              >
                                <span className="dropdown-color-dot" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="compose-field compose-full">
                      <span className="compose-label">Location</span>
                      <input
                        value={eventForm.location}
                        onChange={(event) => setEventForm((current) => ({ ...current, location: event.target.value }))}
                        placeholder="Where?"
                      />
                    </label>
                    <label className="compose-field compose-full">
                      <span className="compose-label">Start Time</span>
                      <div className="time-picker">
                        <input
                          type="text"
                          value={eventForm.startHour}
                          onChange={(event) => {
                            const val = event.target.value.replace(/[^0-9]/g, '').slice(0, 2)
                            setEventForm((current) => ({ ...current, startHour: val }))
                          }}
                          onBlur={() => setEventForm((current) => ({ ...current, startHour: normalizeHourInput(current.startHour) }))}
                          placeholder="HH"
                          maxLength="2"
                          inputMode="numeric"
                          className="time-input"
                        />
                        <span className="time-separator">:</span>
                        <input
                          type="text"
                          value={eventForm.startMinute}
                          onChange={(event) => {
                            const val = event.target.value.replace(/[^0-9]/g, '').slice(0, 2)
                            setEventForm((current) => ({ ...current, startMinute: val }))
                          }}
                          onBlur={() => setEventForm((current) => ({ ...current, startMinute: normalizeMinuteInput(current.startMinute) }))}
                          placeholder="MM"
                          maxLength="2"
                          inputMode="numeric"
                          className="time-input"
                        />
                        <select value={eventForm.startPeriod} onChange={(event) => setEventForm((current) => ({ ...current, startPeriod: event.target.value }))}>
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                      </div>
                    </label>
                    <label className="compose-field compose-full">
                      <span className="compose-label">Repeat</span>
                      <select value={eventForm.repeatType} onChange={(event) => setEventForm((current) => ({ ...current, repeatType: event.target.value }))}>
                        <option value="none">Does not repeat</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="weekly-x">Every week on selected days</option>
                        <option value="monthly">Monthly</option>
                        <option value="every-n-days">Every n days</option>
                      </select>
                    </label>
                    {eventForm.repeatType === 'weekly-x' ? (
                      <div className="compose-field compose-full">
                        <span className="compose-label">Repeat Days</span>
                        <div className="repeat-days-row" role="group" aria-label="Event repeat days">
                          {WEEKDAY_OPTIONS.map((day) => {
                            const isSelected = normalizeRepeatDays(eventForm.repeatWeekDays).includes(day.value)
                            return (
                              <button
                                key={`event-repeat-day-${day.value}`}
                                type="button"
                                className={isSelected ? 'repeat-day-btn active' : 'repeat-day-btn'}
                                onClick={() => toggleEventRepeatDay(day.value)}
                              >
                                {day.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : null}
                    {eventForm.repeatType === 'every-n-days' ? (
                      <label className="compose-field compose-full">
                        <span className="compose-label">Repeat Every (days)</span>
                        <input
                          value={eventForm.repeatEveryNDays}
                          onChange={(event) => setEventForm((current) => ({ ...current, repeatEveryNDays: event.target.value.replace(/[^0-9]/g, '').slice(0, 3) }))}
                          onBlur={() => setEventForm((current) => ({ ...current, repeatEveryNDays: String(Math.max(1, Number.parseInt(current.repeatEveryNDays, 10) || 1)) }))}
                          inputMode="numeric"
                          placeholder="e.g. 2"
                        />
                      </label>
                    ) : null}
                    <label className="compose-field compose-full">
                      <span className="compose-label">End Time</span>
                      <div className="time-picker">
                        <input
                          type="text"
                          value={eventForm.endHour}
                          onChange={(event) => {
                            const val = event.target.value.replace(/[^0-9]/g, '').slice(0, 2)
                            setEventForm((current) => ({ ...current, endHour: val }))
                          }}
                          onBlur={() => setEventForm((current) => ({ ...current, endHour: normalizeHourInput(current.endHour) }))}
                          placeholder="HH"
                          maxLength="2"
                          inputMode="numeric"
                          className="time-input"
                        />
                        <span className="time-separator">:</span>
                        <input
                          type="text"
                          value={eventForm.endMinute}
                          onChange={(event) => {
                            const val = event.target.value.replace(/[^0-9]/g, '').slice(0, 2)
                            setEventForm((current) => ({ ...current, endMinute: val }))
                          }}
                          onBlur={() => setEventForm((current) => ({ ...current, endMinute: normalizeMinuteInput(current.endMinute) }))}
                          placeholder="MM"
                          maxLength="2"
                          inputMode="numeric"
                          className="time-input"
                        />
                        <select value={eventForm.endPeriod} onChange={(event) => setEventForm((current) => ({ ...current, endPeriod: event.target.value }))}>
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                      </div>
                    </label>
                    <textarea
                      value={eventForm.notes}
                      onChange={(event) => setEventForm((current) => ({ ...current, notes: event.target.value }))}
                      placeholder="Event notes"
                      className="compose-full compose-notes"
                    />
                  </div>
                )}
                <button type="submit" disabled={syncing} className="compose-submit-btn">
                  {syncing ? 'Syncing…' : composerMode === 'task' ? (editingTaskId !== null ? 'Save' : 'Submit') : (editingEventId !== null ? 'Save' : 'Create Event')}
                </button>
                {((composerMode === 'task' && editingTaskId !== null) ||
                  (composerMode === 'event' && editingEventId !== null)) && (
                  <button type="button" disabled={syncing} className="compose-delete-btn" onClick={()=>setDeleteConfirmOpen(true)}>
                    Delete
                  </button>
                )}
              </form>
            </div>
          ) : null}


          <nav className="bottom-nav" aria-label="Primary navigation">
            <button type="button" className={screen === 'home' ? 'nav-button active' : 'nav-button'} onClick={() => setScreen('home')}>
              <span className="nav-button-content">
                <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M3 10.5L12 3l9 7.5" />
                  <path d="M5.5 9.5V20h13V9.5" />
                  <path d="M10 20v-6h4v6" />
                </svg>
                <span>Home</span>
              </span>
            </button>
            <button type="button" className={screen === 'weekly' ? 'nav-button active' : 'nav-button'} onClick={() => setScreen('weekly')}>
              <span className="nav-button-content">
                <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3" y="5" width="18" height="16" rx="3" ry="3" />
                  <path d="M3 9h18" />
                  <path d="M8 3v4" />
                  <path d="M16 3v4" />
                  <path d="M7 13h10" />
                  <path d="M7 17h6" />
                </svg>
                <span>Weekly View</span>
              </span>
            </button>
            <button type="button" className={screen === 'monthly' ? 'nav-button active' : 'nav-button'} onClick={() => setScreen('monthly')}>
              <span className="nav-button-content">
                <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3" y="5" width="18" height="16" rx="3" ry="3" />
                  <path d="M3 9h18" />
                  <path d="M8 3v4" />
                  <path d="M16 3v4" />
                  <path d="M8 13h2" />
                  <path d="M12 13h2" />
                  <path d="M16 13h2" />
                  <path d="M8 17h2" />
                  <path d="M12 17h2" />
                  <path d="M16 17h2" />
                </svg>
                <span>Monthly View</span>
              </span>
            </button>
          </nav>
        </section>
      </div>
    </main>
  )
}

export default App