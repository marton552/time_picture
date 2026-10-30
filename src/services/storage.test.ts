import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { City } from './api'
import { loadCity, saveCity, saveTheme } from './storage'

const budapest: City = { id: 1, name: 'Budapest', latitude: 47.5, longitude: 19.04 }

function createStorage() {
  const data = new Map<string, string>()
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createStorage())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('city storage', () => {
  it('loads back a saved city', () => {
    saveCity(budapest)
    expect(loadCity()).toEqual(budapest)
  })

  it('returns null when nothing is saved', () => {
    expect(loadCity()).toBeNull()
  })

  it('ignores broken data', () => {
    localStorage.setItem('city', '{not json')
    expect(loadCity()).toBeNull()
  })

  it('ignores a city without coordinates', () => {
    localStorage.setItem('city', JSON.stringify({ name: 'Budapest' }))
    expect(loadCity()).toBeNull()
  })

  it('does not crash when storage is unavailable', () => {
    const fail = () => {
      throw new Error('blocked')
    }
    vi.stubGlobal('localStorage', { getItem: fail, setItem: fail })
    expect(loadCity()).toBeNull()
    expect(() => saveCity(budapest)).not.toThrow()
  })
})

describe('theme storage', () => {
  it('saves the theme', () => {
    saveTheme('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})
