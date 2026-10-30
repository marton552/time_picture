import type { DayForecast } from '../services/api'
import { describeWeather, formatDay, formatTemperature } from '../utils/weather'

interface Props {
  days: DayForecast[]
}

function Forecast({ days }: Props) {
  return (
    <section>
      <h2>7 napos előrejelzés</h2>
      <ul className="forecast">
        {days.map((day) => {
          const { label, Icon } = describeWeather(day.weatherCode)
          return (
            <li key={day.date}>
              <span className="day">{formatDay(day.date)}</span>
              <span className="precipitation" title="Csapadék valószínűsége">
                <Icon className="forecast-icon" title={label} />
                {day.precipitationProbability ?? 0}%
              </span>
              <span className="temps">
                {formatTemperature(day.min)} / {formatTemperature(day.max)}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Forecast
