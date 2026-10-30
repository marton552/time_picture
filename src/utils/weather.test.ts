import { describe, expect, it } from 'vitest'
import { describeWeather, formatDay, formatTemperature } from './weather'

describe('describeWeather', () => {
  it('returns the Hungarian label for known codes', () => {
    expect(describeWeather(0).label).toBe('Tiszta idő')
    expect(describeWeather(63).label).toBe('Eső')
  })

  it('falls back to unknown for unmapped codes', () => {
    expect(describeWeather(1234).label).toBe('Ismeretlen')
  })
})

describe('formatDay', () => {
  it('returns the capitalized Hungarian day name', () => {
    expect(formatDay('2026-10-30')).toBe('Péntek')
    expect(formatDay('2026-11-02')).toBe('Hétfő')
  })
})

describe('formatTemperature', () => {
  it('rounds and adds the unit', () => {
    expect(formatTemperature(14.6)).toBe('15 °C')
    expect(formatTemperature(-2.6)).toBe('-3 °C')
  })

  it('shows zero without a minus sign', () => {
    expect(formatTemperature(-0.4)).toBe('0 °C')
  })
})
