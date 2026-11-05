# Troubleshooting Guide

## Common Issues & Solutions

### Development & Setup Issues

#### Dev Server Won't Start

**Symptoms**: `npm run dev` fails or hangs

**Solutions**:
1. Clear cache and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be 18 or higher
   npm --version   # Should be 9 or higher
   ```

3. Check if port is already in use:
   ```bash
   # On Windows, find process using port 5173
   netstat -ano | findstr :5173
   # Kill the process if needed
   taskkill /PID <PID> /F
   ```

4. Check for permission issues:
   - Ensure write access to project directory
   - Try running as administrator

#### Hot Module Replacement (HMR) Not Working

**Symptoms**: Changes to files don't reflect in browser without refresh

**Solutions**:
1. Save the file again (sometimes double-save helps)
2. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Restart dev server: Stop with Ctrl+C and run `npm run dev` again
4. Check browser console for errors (F12)
5. If using remote development, ensure HMR configuration is correct in `vite.config.js`

#### Import Errors

**Symptoms**: Console shows `Cannot find module` errors

**Solutions**:
1. Verify file paths are correct (relative to the importing file)
2. Check file extensions (`.jsx`, `.css`, etc.)
3. Restart dev server after file renames
4. Ensure React is imported in files using JSX:
   ```javascript
   import { useState } from 'react'
   ```

### Runtime Issues

#### Tasks/Events Not Appearing

**Symptoms**: Created tasks or events don't show in any view

**Potential Causes**:
1. **Data not loaded**: Check browser console for errors in `fakeBackend.listTasks()` or `fakeBackend.listEvents()`
2. **State not updating**: Verify `setTasks()` or `setEvents()` is called after creating items
3. **Filter active**: Search query might be filtering results; clear search box
4. **Date mismatch**: Task/event date might be in the past or formatted incorrectly
5. **Recurrence issue**: If recurring, check if `repeatType` and related fields are set correctly

**Debugging Steps**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type `window.location.reload()` to refresh
4. Check for JavaScript errors
5. Add logging:
   ```javascript
   console.log('Tasks:', tasks)
   console.log('Events:', events)
   ```

#### Capacity Not Calculating Correctly

**Symptoms**: Heatmap colors seem wrong; capacity percentage doesn't match expectations

**Potential Causes**:
1. **Baseline capacity changed**: Check if the hardcoded daily capacity constant was modified
2. **Difficulty values**: Verify tasks have difficulty 1-5 (not 0 or >5)
3. **Time format issues**: Events might not be parsing start/end times correctly
4. **Duplicate events**: Recurring events might be counted multiple times

**Debugging Steps**:
1. Open a day in Monthly view
2. Manually calculate expected capacity
3. Compare with displayed percentage
4. Check seed data for obvious issues

#### Tasks Persisting After Refresh

**Symptoms**: Tasks still appear after page reload (or don't appear, depending on expectation)

**Note**: This is expected behavior in v0.1. Data is stored in memory only and resets on refresh.

**If unintended persistence**: 
- Check if localStorage is being used (`localStorage.getItem()` calls in code)
- Clear browser storage: DevTools → Application → Storage → Clear Site Data

#### Swipe Gestures Not Working

**Symptoms**: Swiping left/right doesn't navigate between days/weeks/months

**Potential Causes**:
1. **Touch events not captured**: Check if touch event listeners are properly attached
2. **Minimum swipe distance**: Swipe must be longer than threshold; try bigger movements
3. **Mobile emulation**: In DevTools, ensure "Device Emulation" is enabled
4. **Parent element**: Check if a parent container is preventing event propagation

**Debugging Steps**:
1. Open DevTools Console
2. Add logging to touch event handler:
   ```javascript
   window.addEventListener('touchmove', (e) => console.log('Touch:', e))
   ```
3. Test on actual mobile device if possible

### Styling Issues

#### Styles Not Applying

**Symptoms**: CSS changes don't appear in the browser

**Solutions**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Verify CSS is in `src/styles.css` (the only stylesheet)
3. Check CSS selector specificity (if another rule overrides it)
4. Check for typos in class names
5. Restart dev server

#### Layout Broken on Mobile

**Symptoms**: App doesn't display correctly on phone/tablet

**Solutions**:
1. Open DevTools and enable Device Emulation
2. Test different screen sizes (320px, 768px, 1024px)
3. Check media queries in `styles.css`
4. Ensure viewport meta tag is in `index.html`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
5. Test on actual device to verify

### Build & Deployment Issues

#### Build Fails

**Symptoms**: `npm run build` exits with error

**Solutions**:
1. Check build output for specific error
2. Common issues:
   - Missing imports or circular dependencies
   - TypeScript errors (if using TypeScript)
   - Asset path issues
3. Try clean build:
   ```bash
   rm -rf dist node_modules package-lock.json
   npm install
   npm run build
   ```

#### Production Build Looks Wrong

**Symptoms**: `npm run preview` shows incorrect styling or layout

**Potential Causes**:
1. **Base path mismatch**: Vite is configured with `base: '/PlanAware/'`; ensure this matches your deployment
2. **Asset paths**: Check if images/fonts reference correct paths
3. **CSS minification**: Sometimes minification causes issues; test with unminified build
4. **Source maps**: Production doesn't include source maps (for security); debug with dev build

#### Deployment to GitHub Pages Fails

**Symptoms**: `npm run deploy` errors or site doesn't appear at https://alexyellsatcode.github.io/PlanAware/

**Potential Causes**:
1. **gh-pages branch doesn't exist**: Create it:
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   git commit --allow-empty -m "Initial commit"
   git push origin gh-pages
   git checkout main
   ```

2. **GitHub Pages not configured**: Check repository Settings → Pages:
   - Source should be "Deploy from a branch"
   - Branch should be "gh-pages"
   - Folder should be "/ (root)"

3. **CNAME or custom domain conflicts**: If using a custom domain, ensure `CNAME` file is in the build

4. **Deployment workflow fails**: Check GitHub Actions tab for error logs

**Debugging Steps**:
1. Verify `npm run build` succeeds locally
2. Check `dist/` folder is created
3. Run `npm run deploy` with verbose output:
   ```bash
   npm run deploy -- --verbose
   ```
4. Check GitHub repository's gh-pages branch exists
5. Wait 1-2 minutes for GitHub Pages to rebuild after push

### Performance Issues

#### App Feels Slow

**Symptoms**: UI laggy, delays when adding/editing items

**Potential Causes**:
1. **Fake backend latency**: Artificial delays simulate network; check `wait()` function
2. **Inefficient re-renders**: Too many state changes causing re-renders
3. **Missing useMemo**: Expensive calculations re-running every render
4. **Large data set**: Too many tasks/events (try with seed data only)

**Solutions**:
1. Profile with React DevTools Profiler (React DevTools extension)
2. Reduce artificial backend latency for testing:
   ```javascript
   function wait(ms) {
     return new Promise(resolve => setTimeout(resolve, ms / 10))
   }
   ```
3. Add `useMemo` to expensive operations
4. Check for memory leaks in browser DevTools

#### Memory Leaks

**Symptoms**: Browser tab becomes unresponsive over time; memory usage keeps growing

**Potential Causes**:
1. **Event listeners not cleaned up**: Touch/scroll listeners added multiple times
2. **Timers not cleared**: `setInterval()` or `setTimeout()` without cleanup
3. **Large state not garbage collected**: Old versions of state retained

**Solutions**:
1. Always return cleanup function from `useEffect`:
   ```javascript
   useEffect(() => {
     const handler = () => { ... }
     window.addEventListener('touchmove', handler)
     return () => window.removeEventListener('touchmove', handler)
   }, [])
   ```
2. Clear timers on cleanup:
   ```javascript
   const timer = setTimeout(...)
   return () => clearTimeout(timer)
   ```

### Data Issues

#### Data Lost After Refresh

**Symptoms**: Added tasks/events disappear after page reload

**Expected Behavior**: This is normal in v0.1 (data stored in memory only)

**Solutions**:
1. Implement localStorage persistence (see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md))
2. Or implement backend database integration

#### Duplicate Tasks/Events

**Symptoms**: Same task appears multiple times in list

**Potential Causes**:
1. **Recurring expansion**: Recurring items create multiple instances intentionally
2. **Sync issues**: Task added twice due to network retry (would happen with real backend)
3. **State duplication**: Same object added to state multiple times

**Solutions**:
1. Check if item has `repeatType`; if yes, duplicates are intentional
2. Clear seed data and test with fresh start
3. Verify `addTask()` doesn't call `setState` twice

#### Recurrence Not Expanding

**Symptoms**: Recurring task/event only shows on original date, not on future dates

**Potential Causes**:
1. **Missing recurrence fields**: `repeatType` not set or set to undefined
2. **Invalid recurrence data**: `repeatWeekDays` empty or invalid values
3. **Not implemented**: Recurrence expansion might not be fully implemented yet

**Debugging Steps**:
1. Open task in edit mode
2. Verify `repeatType` and related fields are populated
3. Check App.jsx for recurrence expansion logic
4. Add logging:
   ```javascript
   console.log('Recurring instances:', tasks.filter(t => t.repeatType))
   ```

## Getting Help

### Debugging Checklist

Before reaching out for help:
1. ✓ Clear browser cache and hard refresh (Ctrl+Shift+R)
2. ✓ Check browser console for errors (F12 → Console)
3. ✓ Restart dev server (`npm run dev`)
4. ✓ Verify React DevTools is showing correct state
5. ✓ Test with seed data (fresh start)
6. ✓ Check relevant documentation: [ARCHITECTURE.md](./ARCHITECTURE.md), [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

### Useful Commands

```bash
# Check Node/npm versions
node --version && npm --version

# Clear all dependencies and reinstall
rm -rf node_modules package-lock.json && npm install

# Check for Vite diagnostics
npm run build -- --debug

# Run dev server with verbose logging
npm run dev -- --debug

# Test production build locally
npm run build && npm run preview
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `EACCES: permission denied` | Insufficient permissions | Run with `sudo` or check directory permissions |
| `EADDRINUSE` | Port 5173 already in use | Kill process using port or use different port |
| `Cannot find module 'react'` | Missing dependencies | Run `npm install` |
| `Uncaught ReferenceError: React is not defined` | Missing React import | Add `import React from 'react'` |
| `Failed to resolve '@' | Import alias not configured | Check `vite.config.js` for alias configuration |

## Reporting Bugs

When reporting a bug, include:
1. Browser and version (Chrome 120, Safari 17, etc.)
2. Operating system (Windows, macOS, Linux)
3. Steps to reproduce
4. Expected vs. actual behavior
5. Browser console errors (if any)
6. Screenshots or video
7. Node.js and npm versions

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)
- [GitHub Issues](https://github.com/AlexYellsAtCode/PlanAware/issues)
