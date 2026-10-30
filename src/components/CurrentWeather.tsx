import { FiSearch } from 'react-icons/fi'
import type { City } from '../services/api'
import { describeWeather, formatTemperature } from '../utils/weather'

interface Props {
  city: City
  temperature: number
  weatherCode: number
  onCityClick: () => void
}

function CurrentWeather({ city, temperature, weatherCode, onCityClick }: Props) {
  return (
    <section>
      <h2>
        <button type="button" className="city" onClick={onCityClick} title="Város keresése">
          {city.name}
          <FiSearch className="city-icon" aria-hidden />
        </button>
      </h2>
      <p className="current-temp">{formatTemperature(temperature)}</p>
      <p>{describeWeather(weatherCode).label}</p>
    </section>
  )
}

export default CurrentWeather
