export async function fetchWeather(lat: number, lon: number) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY is not defined');
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  return [
    { label: 'Météo', value: data.weather[0].description },
    { label: 'Température', value: `${Math.round(data.main.temp)}°C` },
    { label: 'Vent', value: `${(data.wind.speed * 3.6).toFixed(1)} km/h` },
    { label: 'Houle', value: '0.4 m' }, // OpenWeather doesn't provide swell in free tier easily, keep mocked
    { label: 'Visibilité', value: `${(data.visibility / 1000).toFixed(1)} km` },
    { label: 'Humidité', value: `${data.main.humidity}%` }
  ];
}
