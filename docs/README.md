# Documentation Index

Welcome to PlanAware Documentation! This folder contains comprehensive guides to help you understand, develop, and maintain the project.

## 📖 Documentation Files

### 1. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ⭐ Start Here
Quick overview of commands, state variables, and common patterns. Best for quick lookups and refreshing your memory.

**Contains**:
- 5-minute quick start
- Common commands
- Key file locations
- State and data structures
- Debugging tips
- Known limitations

---

### 2. **[ARCHITECTURE.md](./ARCHITECTURE.md)**
Deep dive into the system design, how components work together, and the overall structure of the application.

**Contains**:
- Technology stack
- Core architecture (state management, data model)
- Data models for tasks and events
- Fake backend design
- View descriptions (Home, Weekly, Monthly)
- Capacity calculation formula
- Component flow diagram
- Performance considerations

---

### 3. **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**
Step-by-step guide for developers making changes to the codebase.

**Contains**:
- Installation and setup instructions
- Development workflow and scripts
- Key concepts explanation
- Code examples for common tasks
- How to add new features
- Debugging techniques
- Common tasks and how to implement them
- Troubleshooting development issues

---

### 4. **[DATA_MODEL.md](./DATA_MODEL.md)**
Complete specification of data structures, validation rules, and the capacity model.

**Contains**:
- Task data model with all fields
- Event data model with all fields
- Recurrence types and behavior
- Capacity calculation model
- Validation rules
- API response formats
- Category taxonomy
- Examples of tasks and events

---

### 5. **[FEATURES.md](./FEATURES.md)**
Detailed descriptions of all features, use cases, and user interactions.

**Contains**:
- Task management features (create, edit, complete, delete)
- Event management features
- Planning views (Daily, Weekly, Monthly)
- Recurring items explanation
- Navigation and interaction patterns
- Data visualization features
- Real-world use case scenarios
- Future feature ideas

---

### 6. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
Solutions for common issues and problems you might encounter.

**Contains**:
- Development setup issues
- Runtime issues (data not appearing, etc.)
- Styling problems
- Build and deployment issues
- Performance debugging
- Data persistence issues
- Error messages and solutions
- Getting help checklist
- Common commands for debugging

---

## 🎯 How to Use This Documentation

### I want to...

- **Get started quickly** → Read [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Understand the codebase** → Start with [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Make code changes** → Follow [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Learn about data structures** → See [DATA_MODEL.md](./DATA_MODEL.md)
- **Understand what features exist** → Check [FEATURES.md](./FEATURES.md)
- **Fix a problem** → Look in [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📊 Quick Project Overview

**PlanAware** is a productivity app that combines tasks and calendar events in an integrated interface.

### Key Facts:
- **Framework**: React 18 with Vite
- **Storage**: In-memory (no persistence yet)
- **Views**: Daily (timeline), Weekly (buckets), Monthly (heatmap)
- **Features**: Create/edit/delete tasks & events, recurring items, capacity visualization
- **Deployment**: GitHub Pages

### Technology Stack:
```
Frontend: React 18
Build: Vite 8
Styling: Plain CSS
State: React hooks (useState, useEffect, useMemo)
Backend: Simulated (in-memory)
Hosting: GitHub Pages
```

## 🚀 Common Workflows

### Start Development
```bash
npm install
npm run dev
# Open http://localhost:5173/PlanAware/
```

### Build for Production
```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## 📝 Documentation Notes

- All documentation is in **Markdown** format
- Code examples use **JavaScript (ES6+)** syntax
- Screenshots and diagrams are described in text (not included yet)
- Documentation assumes basic React knowledge
- Examples use the actual code from the project

## 🔄 Keeping Documentation Updated

When making significant changes to the project:

1. Update relevant documentation files
2. Add examples if introducing new concepts
3. Update [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) if commands or scripts change
4. Note breaking changes or deprecations
5. Add any new troubleshooting solutions to [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📚 Additional Resources

- **Project Repository**: https://github.com/AlexYellsAtCode/PlanAware
- **Live Demo**: https://alexyellsatcode.github.io/PlanAware/
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

## ❓ Questions?

If you can't find an answer:

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for known issues
2. Search the documentation files
3. Check browser console for errors (F12)
4. Review code comments in `src/App.jsx`
5. Open an issue on GitHub

---

**Last Updated**: November 5, 2026  
**Project Version**: v0.1 (MVP)  
**Status**: Active Development
