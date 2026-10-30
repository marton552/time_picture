import type { City } from './api'

const CITY_KEY = 'city'
const THEME_KEY = 'theme'

export function loadCity(): City | null {
  try {
    const city = JSON.parse(localStorage.getItem(CITY_KEY) ?? 'null')
    return typeof city?.latitude === 'number' && typeof city?.longitude === 'number' ? city : null
  } catch {
    return null
  }
}

export function saveCity(city: City) {
  try {
    localStorage.setItem(CITY_KEY, JSON.stringify(city))
  } catch {
    // Storage unavailable (e.g. private mode), the city just won't be remembered
  }
}

// Read back by the inline script in index.html before React loads
export function saveTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Storage unavailable, the theme just won't be remembered
  }
}
