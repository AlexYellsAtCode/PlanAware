# Demo Mode Documentation

This directory contains documentation and setup guides for running PlanAware in demo mode.

## Files

- **[DEMO_MODE.md](./DEMO_MODE.md)** - Complete guide to running PlanAware with sample seed data

## Quick Start

### Run with Demo Data
```bash
npm run demo
```

### Build Production with Demo Data
```bash
npm run build:demo
```

## What's Included

The demo mode pre-loads:
- 10 sample tasks across different categories and priorities
- 2 recurring course lectures with specific times and locations
- Various due dates and times throughout the week
- Mix of completed and pending tasks

This allows you to:
- Explore the UI with realistic data
- Test features without manual data entry
- Demonstrate the app to stakeholders
- See how the capacity visualization works

## See Also

- [docs/DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md) - Development setup and workflow
- [docs/QUICK_REFERENCE.md](../QUICK_REFERENCE.md) - Quick lookup of common commands
- [src/seedData.js](../../src/seedData.js) - Source of seed data
