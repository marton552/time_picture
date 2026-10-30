import { afterEach, describe, expect, it, vi } from 'vitest'
import { getWeather, searchCities, type City } from './api'

const budapest: City = { id: 1, name: 'Budapest', latitude: 47.5, longitude: 19.04 }

function mockFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn(async (_url: string) => new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function requestedParams(fetchMock: ReturnType<typeof mockFetch>) {
  return new URL(fetchMock.mock.calls[0][0]).searchParams
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('searchCities', () => {
  it('returns the cities from the response', async () => {
    mockFetch({ results: [budapest] })
    expect(await searchCities('Budapest')).toEqual([budapest])
  })

  it('returns an empty list when nothing matches', async () => {
    mockFetch({ generationtime_ms: 0.1 })
    expect(await searchCities('xyz')).toEqual([])
  })

  it('requests Hungarian names', async () => {
    const fetchMock = mockFetch({})
    await searchCities('Szeged')
    const params = requestedParams(fetchMock)
    expect(params.get('name')).toBe('Szeged')
    expect(params.get('language')).toBe('hu')
  })

  it('throws on server error', async () => {
    mockFetch({ error: true }, 500)
    await expect(searchCities('Budapest')).rejects.toThrow('HTTP 500')
  })
})

describe('getWeather', () => {
  it('maps the response to current weather and daily forecast', async () => {
    mockFetch({
      current: { temperature_2m: 14.3, weather_code: 0 },
      daily: {
        time: ['2026-10-30', '2026-10-31'],
        weather_code: [3, 61],
        temperature_2m_min: [8.1, 7],
        temperature_2m_max: [16.6, 13.4],
        precipitation_probability_max: [4, null],
      },
    })
    expect(await getWeather(budapest)).toEqual({
      temperature: 14.3,
      weatherCode: 0,
      days: [
        { date: '2026-10-30', weatherCode: 3, min: 8.1, max: 16.6, precipitationProbability: 4 },
        { date: '2026-10-31', weatherCode: 61, min: 7, max: 13.4, precipitationProbability: null },
      ],
    })
  })

  it('requests a 7-day forecast for the city coordinates', async () => {
    const fetchMock = mockFetch({ current: {}, daily: { time: [] } })
    await getWeather(budapest)
    const params = requestedParams(fetchMock)
    expect(params.get('latitude')).toBe('47.5')
    expect(params.get('longitude')).toBe('19.04')
    expect(params.get('forecast_days')).toBe('7')
  })

  it('throws on server error', async () => {
    mockFetch({ error: true }, 400)
    await expect(getWeather(budapest)).rejects.toThrow('HTTP 400')
  })
})
