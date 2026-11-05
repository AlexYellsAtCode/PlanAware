import { StatusBar } from './StatusBar'

/**
 * PhoneFrameWrapper
 * 
 * Wraps app content in a phone mockup frame for desktop/web viewing.
 * When running on actual mobile devices, the frame is hidden and the app
 * displays full-screen and responsively.
 * 
 * @param {React.ReactNode} children - App content to display
 * @param {Date} currentTime - Current time for status bar
 * @param {boolean} isMobileMode - Whether to show phone frame (false on mobile)
 */
export function PhoneFrameWrapper({ children, currentTime, isMobileMode }) {
  if (isMobileMode) {
    // On actual mobile devices, show app full-screen without phone frame
    return <div className="mobile-app-shell">{children}</div>
  }

  // On desktop/web, show phone mockup frame
  return (
    <main className="page-shell">
      <div className="phone-frame">
        <StatusBar currentTime={currentTime} />
        <section className="app-card">{children}</section>
      </div>
    </main>
  )
}
