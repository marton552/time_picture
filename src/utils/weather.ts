import type { IconType } from 'react-icons'
import {
  WiCloudy,
  WiDayCloudy,
  WiDaySunny,
  WiDaySunnyOvercast,
  WiFog,
  WiHail,
  WiNa,
  WiRain,
  WiRainMix,
  WiShowers,
  WiSleet,
  WiSnow,
  WiSnowflakeCold,
  WiSprinkle,
  WiThunderstorm,
} from 'react-icons/wi'

interface WeatherInfo {
  label: string
  Icon: IconType
}

// WMO weather codes, see https://open-meteo.com/en/docs
const WEATHER_CODES: Record<number, WeatherInfo> = {
  0: { label: 'Tiszta idő', Icon: WiDaySunny },
  1: { label: 'Túlnyomóan derült', Icon: WiDaySunnyOvercast },
  2: { label: 'Részben felhős', Icon: WiDayCloudy },
  3: { label: 'Borult', Icon: WiCloudy },
  45: { label: 'Köd', Icon: WiFog },
  48: { label: 'Zúzmarás köd', Icon: WiFog },
  51: { label: 'Gyenge szitálás', Icon: WiSprinkle },
  53: { label: 'Szitálás', Icon: WiSprinkle },
  55: { label: 'Erős szitálás', Icon: WiSprinkle },
  56: { label: 'Gyenge ónos szitálás', Icon: WiSleet },
  57: { label: 'Ónos szitálás', Icon: WiSleet },
  61: { label: 'Gyenge eső', Icon: WiRain },
  63: { label: 'Eső', Icon: WiRain },
  65: { label: 'Erős eső', Icon: WiRain },
  66: { label: 'Gyenge ónos eső', Icon: WiRainMix },
  67: { label: 'Ónos eső', Icon: WiRainMix },
  71: { label: 'Gyenge havazás', Icon: WiSnow },
  73: { label: 'Havazás', Icon: WiSnow },
  75: { label: 'Erős havazás', Icon: WiSnow },
  77: { label: 'Hószemcse', Icon: WiSnowflakeCold },
  80: { label: 'Gyenge zápor', Icon: WiShowers },
  81: { label: 'Zápor', Icon: WiShowers },
  82: { label: 'Heves zápor', Icon: WiShowers },
  85: { label: 'Hózápor', Icon: WiSnow },
  86: { label: 'Erős hózápor', Icon: WiSnow },
  95: { label: 'Zivatar', Icon: WiThunderstorm },
  96: { label: 'Zivatar jégesővel', Icon: WiHail },
  99: { label: 'Erős zivatar jégesővel', Icon: WiHail },
}

const UNKNOWN: WeatherInfo = { label: 'Ismeretlen', Icon: WiNa }

export function describeWeather(code: number): WeatherInfo {
  return WEATHER_CODES[code] ?? UNKNOWN
}

// Dates come as plain YYYY-MM-DD, formatting in UTC keeps the day from shifting
const dayFormat = new Intl.DateTimeFormat('hu', { weekday: 'long', timeZone: 'UTC' })

export function formatDay(date: string): string {
  const day = dayFormat.format(new Date(date))
  return day.charAt(0).toUpperCase() + day.slice(1)
}

export function formatTemperature(value: number): string {
  return `${Math.round(value)} °C`
}
