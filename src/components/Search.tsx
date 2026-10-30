import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { searchCities, type City } from '../services/api'

const MIN_AUTO_SEARCH_LENGTH = 3
const AUTO_SEARCH_DELAY_MS = 300

interface Props {
  onSelect: (city: City) => void
}

function Search({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<City[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'empty' | 'error'>('idle')
  const timer = useRef<number>(undefined)
  const latestRequest = useRef(0)

  async function runSearch(name: string) {
    const request = ++latestRequest.current
    setStatus('loading')
    try {
      const cities = await searchCities(name)
      if (request !== latestRequest.current) return
      setResults(cities)
      setStatus(cities.length ? 'idle' : 'empty')
    } catch {
      if (request !== latestRequest.current) return
      setResults([])
      setStatus('error')
    }
  }

  useEffect(() => {
    const name = query.trim()
    if (name.length < MIN_AUTO_SEARCH_LENGTH) return
    timer.current = window.setTimeout(() => runSearch(name), AUTO_SEARCH_DELAY_MS)
    return () => clearTimeout(timer.current)
  }, [query])

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    clearTimeout(timer.current)
    const name = query.trim()
    if (name) runSearch(name)
  }

  function handleSelect(city: City) {
    setResults([])
    onSelect(city)
  }

  return (
    <section>
      <form className="search" onSubmit={handleSubmit}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Város neve"
          aria-label="Város neve"
        />
        <button type="submit" disabled={status === 'loading'}>
          Keresés
        </button>
      </form>
      {status === 'empty' && <p className="message">Nincs találat.</p>}
      {status === 'error' && <p className="message">Hiba történt a keresés során.</p>}
      {results.length > 0 && (
        <ul className="results">
          {results.map((city) => (
            <li key={city.id}>
              <button type="button" onClick={() => handleSelect(city)}>
                {city.name}
                <span className="region">{[city.admin1, city.country].filter(Boolean).join(', ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Search
