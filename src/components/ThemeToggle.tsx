import { useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { saveTheme } from '../services/storage'

type Theme = 'light' | 'dark'

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    // Only animate on user toggles, not on page load
    root.dataset.animate = ''
    root.dataset.theme = next
    saveTheme(next)
    setTheme(next)
  }

  const label = theme === 'dark' ? 'Világos mód' : 'Sötét mód'

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {theme === 'dark' ? <FiSun aria-hidden /> : <FiMoon aria-hidden />}
    </button>
  )
}

export default ThemeToggle
