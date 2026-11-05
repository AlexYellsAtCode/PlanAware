# Documentation Index

Welcome to PlanAware Documentation! This folder contains comprehensive guides organized by topic to help you understand, develop, and maintain the project.

## 📁 Documentation Directories

### 📘 [guides/](./guides/) - Getting Started & Development
Your starting point for setup and day-to-day development.

**Contains**:
- [QUICK_REFERENCE.md](./guides/QUICK_REFERENCE.md) ⭐ - Quick command lookup and state overview
- [DEVELOPER_GUIDE.md](./guides/DEVELOPER_GUIDE.md) - Installation, setup, and development workflow
- [ENV_CONFIGURATION.md](./guides/ENV_CONFIGURATION.md) - Environment variables configuration

---

### 🎬 [demo/](./demo/) - Demo Mode & Testing
Setup and usage of demo mode with sample seed data.

**Contains**:
- [DEMO_MODE.md](./demo/DEMO_MODE.md) - Complete guide to running with sample data
- [README.md](./demo/README.md) - Demo directory index

---

### 🏗️ [design/](./design/) - Architecture & Data
System design and technical specifications.

**Contains**:
- [ARCHITECTURE.md](./design/ARCHITECTURE.md) - System design and component structure
- [DATA_MODEL.md](./design/DATA_MODEL.md) - Data structures and specifications
- [PHONE_SIMULATION_ARCHITECTURE.md](./design/PHONE_SIMULATION_ARCHITECTURE.md) - Phone UI separation design
- [ARCHITECTURE_IMPLEMENTATION.md](./design/ARCHITECTURE_IMPLEMENTATION.md) - Complete implementation guide
- [PHONE_SIMULATION_IMPLEMENTATION.md](./design/PHONE_SIMULATION_IMPLEMENTATION.md) - Technical implementation details
- [README.md](./design/README.md) - Design directory index

---

### 🔌 [reference/](./reference/) - Troubleshooting & Support
Solutions for problems and debugging guidance.

**Contains**:
- [TROUBLESHOOTING.md](./reference/TROUBLESHOOTING.md) - Common issues and solutions
- [TESTING_GUIDE.html](./reference/TESTING_GUIDE.html) - Interactive browser testing guide
- [README.md](./reference/README.md) - Reference directory index

---

## 🎯 Quick Navigation by Need

### I want to...

| Need | Go To |
|------|-------|
| **Get started quickly** | [guides/QUICK_REFERENCE.md](./guides/QUICK_REFERENCE.md) ⭐ |
| **Set up development** | [guides/DEVELOPER_GUIDE.md](./guides/DEVELOPER_GUIDE.md) |
| **Run with demo data** | [demo/DEMO_MODE.md](./demo/DEMO_MODE.md) |
| **Understand the system** | [design/ARCHITECTURE.md](./design/ARCHITECTURE.md) |
| **Learn data structures** | [design/DATA_MODEL.md](./design/DATA_MODEL.md) |
| **Understand phone UI architecture** | [design/PHONE_SIMULATION_ARCHITECTURE.md](./design/PHONE_SIMULATION_ARCHITECTURE.md) |
| **Set environment variables** | [guides/ENV_CONFIGURATION.md](./guides/ENV_CONFIGURATION.md) |
| **Test the phone simulation** | [reference/TESTING_GUIDE.html](./reference/TESTING_GUIDE.html) |
| **Explore features** | [features/FEATURES.md](./features/FEATURES.md) |
| **Fix a problem** | [reference/TROUBLESHOOTING.md](./reference/TROUBLESHOOTING.md) |

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
