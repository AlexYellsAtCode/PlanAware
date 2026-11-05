/**
 * Detect if the app is running on a mobile device or as a native app
 * Returns true for mobile/PWA environments, false for desktop browsers
 */
export function isMobileEnvironment() {
  // Check if running as a PWA (installed app) or with viewport meta tag
  const isStandalone = window.navigator.standalone === true || 
                       window.matchMedia('(display-mode: standalone)').matches ||
                       window.matchMedia('(display-mode: fullscreen)').matches

  // Check mobile user agent
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // Check viewport width - mobile typically < 768px
  const isMobileViewport = window.innerWidth < 768

  // If explicitly set via environment variable (for testing)
  if (import.meta.env.VITE_MOBILE_MODE === 'true') {
    return true
  }
  if (import.meta.env.VITE_MOBILE_MODE === 'false') {
    return false
  }

  // Return true if any mobile indicator is detected
  return isStandalone || isMobileUserAgent || isMobileViewport
}

/**
 * Detect if viewport is mobile-sized (used for responsive breakpoints)
 */
export function isMobileViewport() {
  return window.innerWidth < 768
}
