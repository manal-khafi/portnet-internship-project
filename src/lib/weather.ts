export async function fetchWeather(lat: number, lon: number) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error('OPENWEATHER_API_KEY is missing');
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Weather API returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    return [
      { label: 'Météo', value: data.weather[0].description },
      { label: 'Température', value: `${Math.round(data.main.temp)}°C` },
      { label: 'Vent', value: `${(data.wind.speed * 3.6).toFixed(1)} km/h` },
      { label: 'Houle', value: '0.4 m' },
      { label: 'Visibilité', value: `${(data.visibility / 1000).toFixed(1)} km` },
      { label: 'Humidité', value: `${data.main.humidity}%` }
    ];
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Weather fetch timed out');
    } else {
      console.error('Failed to fetch weather data:', error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
