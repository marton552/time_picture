import { useEffect, useState } from 'react'
import { getWeather, type City, type Weather } from './services/api'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import SearchModal from './components/SearchModal'
import TemperatureChart from './components/TemperatureChart'
import ThemeToggle from './components/ThemeToggle'
import { loadCity, saveCity } from './services/storage'

function App() {
  const [city, setCity] = useState<City | null>(loadCity)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [searchOpen, setSearchOpen] = useState(false)

  async function loadWeather(selected: City) {
    setWeather(null)
    setStatus('loading')
    try {
      setWeather(await getWeather(selected))
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    if (city) loadWeather(city)
  }, [])

  function handleSelect(selected: City) {
    setSearchOpen(false)
    setCity(selected)
    saveCity(selected)
    loadWeather(selected)
  }

  return (
    <>
      <main className="app">
        <ThemeToggle />
        <SearchModal
          open={searchOpen || !city}
          dismissible={city !== null}
          onClose={() => setSearchOpen(false)}
          onSelect={handleSelect}
        />
        {status === 'loading' && <p className="message">Betöltés…</p>}
        {status === 'error' && (
          <p className="message">
            Nem sikerült lekérni az időjárást.{' '}
            <button type="button" className="link" onClick={() => setSearchOpen(true)}>
              Másik város
            </button>
          </p>
        )}
        {city && weather && (
          <div className="weather">
            <CurrentWeather
              city={city}
              temperature={weather.temperature}
              weatherCode={weather.weatherCode}
              onCityClick={() => setSearchOpen(true)}
            />
            <div className="forecast-column">
              <Forecast days={weather.days} />
              <TemperatureChart days={weather.days} />
            </div>
          </div>
        )}
      </main>
      <footer className="footer">Peszleg Márton</footer>
    </>
  )
}

export default App
