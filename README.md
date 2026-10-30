# time_picture

Weather app built with React, TypeScript and Vite. Data comes from [Open-Meteo](https://open-meteo.com/) (no API key needed).

## Features

- City search in a modal (Open-Meteo Geocoding API). Opens automatically on first visit, later by clicking the city name.
- The selected city is saved in the browser (`localStorage`) and loaded on the next visit.
- Current temperature and condition.
- 7-day forecast: day name, condition icon, precipitation probability, min and max temperature.
- Chart of the daily max temperatures, values shown on hover.
- Light/dark mode switch (top right). The sky animates through sunset when switching. Defaults to light, the choice is saved in the browser.

## Requirements

- Node.js 22.12 or newer

## Run

```sh
npm install
npm run build
npm start
```

Then open the URL printed in the terminal.

## Development

```sh
npm run dev
```

Starts a dev server with hot reload.

## Tests

```sh
npm test
```

Unit tests with [Vitest](https://vitest.dev/) for the weather formatting, the API response handling (with a fake `fetch`) and the browser storage.

## Project structure

```
index.html                  HTML entry
src/
  main.tsx                  React bootstrap
  App.tsx                   Root component, holds selected city and weather
  index.css                 Global styles
  components/               UI components
    SearchModal.tsx         Modal around the city search
    Search.tsx              City search box and result list
    CurrentWeather.tsx      Current temperature and condition
    Forecast.tsx            7-day forecast list
    TemperatureChart.tsx    Daily max temperature chart
    ThemeToggle.tsx         Light/dark mode switch
  services/                 Communication with the outside world
    api.ts                  Open-Meteo geocoding and forecast requests
    storage.ts              Saving the selected city and theme
  utils/                    Pure helper functions
    weather.ts              Weather code mapping, day and temperature formatting
```

Unit tests (`*.test.ts`) sit next to the file they test.

## Libraries

- [react-icons](https://react-icons.github.io/react-icons/): weather and UI icons
- [Recharts](https://recharts.org/): temperature chart
