export function StatusBar({ currentTime }) {
  function toClockLabel(date) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return (
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
  )
}
