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

export const seedTasks = [
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

export const seedEvents = [
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
