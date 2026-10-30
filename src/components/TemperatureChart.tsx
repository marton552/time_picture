import { useEffect, useRef, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DayForecast } from '../services/api'
import { formatDay, formatTemperature } from '../utils/weather'

interface Props {
  days: DayForecast[]
}

function TemperatureChart({ days }: Props) {
  const data = days.map((day) => ({ day: formatDay(day.date), max: day.max }))
  const ref = useRef<HTMLDivElement>(null)
  const [tooltipHidden, setTooltipHidden] = useState(false)

  // Touch keeps the tooltip open, so hide it on any press outside the chart
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      setTooltipHidden(!ref.current?.contains(e.target as Node))
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return (
    <div ref={ref} className="chart" onPointerMove={() => setTooltipHidden(false)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 24, right: 0, bottom: 24, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--line)" />
          <XAxis dataKey="day" hide />
          <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} tickCount={3} />
          <Tooltip
            active={tooltipHidden ? false : undefined}
            formatter={(value) => [formatTemperature(Number(value)), 'Max']}
            separator=": "
            cursor={{ stroke: 'var(--line)' }}
            contentStyle={{
              background: 'var(--sky-top)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              color: '#fff',
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#fff"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: '#fff', stroke: 'none' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TemperatureChart
