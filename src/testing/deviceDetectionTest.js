// Test file to verify device detection works correctly
// This can be run in the browser console to verify mobile detection

export function testDeviceDetection() {
  console.log('=== Device Detection Tests ===')

  // Test 1: Check current environment
  console.log('\nTest 1: Current Environment')
  console.log('User Agent:', navigator.userAgent)
  console.log('Window Width:', window.innerWidth)
  console.log('Window Height:', window.innerHeight)
  console.log('Standalone:', window.navigator.standalone)
  
  // Test 2: Check media query
  const isMobileMediaQuery = window.matchMedia('(display-mode: standalone)').matches ||
                              window.matchMedia('(display-mode: fullscreen)').matches
  console.log('\nTest 2: PWA Display Mode')
  console.log('Standalone/Fullscreen mode:', isMobileMediaQuery)

  // Test 3: Check viewport
  console.log('\nTest 3: Viewport Size')
  const isMobileViewport = window.innerWidth < 768
  console.log('Mobile viewport (<768px):', isMobileViewport)

  // Test 4: Simulate mobile mode by checking what class is applied
  const root = document.getElementById('root')
  const hasPhoneFrame = document.querySelector('.phone-frame') !== null
  const hasMobileShell = document.querySelector('.mobile-app-shell') !== null
  
  console.log('\nTest 4: Current Rendering Mode')
  console.log('Phone frame visible:', hasPhoneFrame)
  console.log('Mobile shell visible:', hasMobileShell)

  // Test 5: Check status bar
  const statusBar = document.querySelector('.status-bar')
  console.log('\nTest 5: Status Bar')
  console.log('Status bar visible:', statusBar !== null)
  if (statusBar) {
    console.log('Status bar HTML:', statusBar.innerHTML)
  }

  // Test 6: Simulation instructions
  console.log('\n=== To Test Mobile Mode ===')
  console.log('1. Open DevTools (F12)')
  console.log('2. Click Toggle device toolbar (Ctrl+Shift+M)')
  console.log('3. Watch the layout re-render')
  console.log('4. At <768px width, phone frame should expand to full width')
  console.log('5. To force mobile mode: add VITE_MOBILE_MODE=true to build')
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.testDeviceDetection = testDeviceDetection
}
