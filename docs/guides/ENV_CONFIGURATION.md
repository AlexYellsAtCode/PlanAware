# Environment Configuration Guide

This guide explains the environment variables and configuration files used in PlanAware.

## 📁 Environment Files

Environment files are kept in the root directory following standard Node.js conventions:

### `.env.demo` (Included in Repository)
Configuration for demo mode with sample seed data.

```env
# Demo mode configuration
# This file documents the demo mode setup for PlanAware

# To run the application with seed data (demo mode):
# npm run demo

# To build a production version with seed data:
# npm run build:demo

# The VITE_USE_SEED_DATA environment variable controls whether to load sample tasks and events
# Set it to 'true' to enable seed data
VITE_USE_SEED_DATA=false
```

**Usage:**
```bash
VITE_USE_SEED_DATA=true npm run dev
# App loads with sample tasks and events
```

### `.env.test` (For Testing & Development)
Configuration for testing mobile mode and other features.

```env
# Environment variables for testing

# Uncomment one of the following to test mobile/desktop mode:

# Force desktop mode (default behavior)
# VITE_MOBILE_MODE=false

# Force mobile mode (to test full-screen layout)
# VITE_MOBILE_MODE=true

# Use seed data for testing
# VITE_USE_SEED_DATA=true
```

**Usage:**
```bash
VITE_MOBILE_MODE=true npm run dev
# App renders in mobile mode at any viewport size
```

## 🔑 Available Environment Variables

### `VITE_USE_SEED_DATA`
Controls whether the app loads sample tasks and events.

| Value | Behavior |
|-------|----------|
| `true` | Load demo tasks and events from seedData.js |
| `false` (default) | Start with empty task/event lists |

**Example:**
```bash
VITE_USE_SEED_DATA=true npm run dev
```

### `VITE_MOBILE_MODE`
Forces the app to render in a specific mode (desktop frame or mobile layout).

| Value | Behavior |
|-------|----------|
| `true` | Always render full-screen mobile layout (no phone frame) |
| `false` | Always render phone frame mockup (desktop mode) |
| unset (default) | Auto-detect based on device/viewport |

**Example:**
```bash
# Test mobile layout without changing viewport
VITE_MOBILE_MODE=true npm run dev

# Force desktop frame at any viewport
VITE_MOBILE_MODE=false npm run dev
```

**When to use:**
- **Testing**: Verify mobile layout without resizing browser
- **Debugging**: Force specific mode for easier reproduction
- **CI/CD**: Test both modes in automated pipelines
- **Demo**: Force desktop frame on mobile devices for mockup viewing

## 🎯 Common Workflows

### Run with Sample Data
```bash
VITE_USE_SEED_DATA=true npm run dev
```

### Test Mobile Mode
```bash
VITE_MOBILE_MODE=true npm run dev
```

### Test Both Features Together
```bash
VITE_USE_SEED_DATA=true VITE_MOBILE_MODE=true npm run dev
```

### Production Build with Demo Data
```bash
VITE_USE_SEED_DATA=true npm run build
npm run preview  # preview production build
```

## 📊 Environment Variable Matrix

| Scenario | Command |
|----------|---------|
| **Default** (auto-detect, no seed) | `npm run dev` |
| **Desktop mockup + demo data** | `VITE_USE_SEED_DATA=true npm run dev` |
| **Mobile full-screen + demo data** | `VITE_MOBILE_MODE=true VITE_USE_SEED_DATA=true npm run dev` |
| **Force desktop at any size** | `VITE_MOBILE_MODE=false npm run dev` |
| **Force mobile at any size** | `VITE_MOBILE_MODE=true npm run dev` |
| **Production (no demo)** | `npm run build && npm run preview` |
| **Production (with demo)** | `VITE_USE_SEED_DATA=true npm run build && npm run preview` |

## 🔒 Security Notes

- Environment files containing sensitive data should NOT be committed to version control
- `.env` files (without suffix) are typically gitignored
- `.env.*.local` files are used for local overrides and should be gitignored
- Example `.env.demo` and `.env.test` are safe to commit as documentation

## 🚀 How Variables Are Read

Environment variables are read by Vite during build time:

```javascript
// In src/App.jsx or other files
const shouldUseSeedData = import.meta.env.VITE_USE_SEED_DATA === 'true'
const isMobileMode = import.meta.env.VITE_MOBILE_MODE === 'true'
```

**Important**: 
- Variables must start with `VITE_` to be exposed to the client
- Values are strings; compare with `=== 'true'` not `=== true`
- Variables are baked into the build; changing them requires rebuild in dev mode

## 📝 Creating Custom Environment Files

To create your own configuration:

1. Create a new `.env.local` file in the root
2. Add your variables starting with `VITE_`
3. The file will be loaded automatically by Vite
4. Add to `.gitignore` to prevent accidental commits

**Example `.env.local`:**
```env
# My custom development configuration
VITE_USE_SEED_DATA=true
VITE_MOBILE_MODE=false
```

## 🔄 Overriding Environment Variables

Command-line variables override `.env` files:

```bash
# This overrides VITE_USE_SEED_DATA from any .env file
VITE_USE_SEED_DATA=false npm run dev
```

**Priority order** (highest to lowest):
1. Command-line environment variables
2. `.env.local` (not committed)
3. `.env.[mode].local` (not committed)
4. `.env.[mode]`
5. `.env` (default)

## 📚 Further Reading

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [App.jsx](../src/App.jsx) - See where variables are used
- [Device Detection](../src/utils/deviceDetection.js) - Mobile mode detection logic
- [TESTING_GUIDE.html](./TESTING_GUIDE.html) - Interactive testing guide

## ❓ Troubleshooting

### Variable not taking effect
- Make sure it starts with `VITE_` prefix
- Restart dev server after changing `.env` file
- Check that value is lowercase `'true'` or `'false'` (strings)

### Different behavior on build vs dev
- Dev server hot-reloads; rebuild after `.env` changes
- Production build bakes variables at build time
- Use `npm run preview` to test production build locally

### Want to add a new variable?
1. Create it in `.env.demo`, `.env.test`, or `.env.local`
2. Prefix with `VITE_`
3. Read it with `import.meta.env.VITE_YOUR_VAR_NAME`
4. Restart dev server

---

**Last Updated**: November 5, 2026  
**Related**: [TESTING_GUIDE.html](./TESTING_GUIDE.html), [IMPLEMENTATION.md](./IMPLEMENTATION.md)
