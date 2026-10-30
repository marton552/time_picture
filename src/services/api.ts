const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export interface City {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

export interface DayForecast {
  date: string
  weatherCode: number
  min: number
  max: number
  precipitationProbability: number | null
}

export interface Weather {
  temperature: number
  weatherCode: number
  days: DayForecast[]
}

interface ForecastResponse {
  current: { temperature_2m: number; weather_code: number }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_min: number[]
    temperature_2m_max: number[]
    precipitation_probability_max: (number | null)[]
  }
}

async function getJson<T>(url: string, params: Record<string, string>): Promise<T> {
  const res = await fetch(`${url}?${new URLSearchParams(params)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * Searches cities by name using the Open-Meteo Geocoding API.
 * @returns Matching cities, or an empty array if none found.
 */
export async function searchCities(name: string): Promise<City[]> {
  const data = await getJson<{ results?: City[] }>(GEOCODING_URL, {
    name,
    count: '10',
    language: 'hu',
    format: 'json',
  })
  return data.results ?? []
}

/**
 * Fetches current weather and a 7-day forecast for a city using the Open-Meteo Forecast API.
 * Dates are in the city's local timezone.
 */
export async function getWeather(city: City): Promise<Weather> {
  const { current, daily } = await getJson<ForecastResponse>(FORECAST_URL, {
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  })
  return {
    temperature: current.temperature_2m,
    weatherCode: current.weather_code,
    days: daily.time.map((date, i) => ({
      date,
      weatherCode: daily.weather_code[i],
      min: daily.temperature_2m_min[i],
      max: daily.temperature_2m_max[i],
      precipitationProbability: daily.precipitation_probability_max[i],
    })),
  }
}
