export async function fetchWeather(lat: number, lon: number) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    console.warn('Weather API key missing - skipping fetch');
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // Shorter timeout for better UX

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`,
      { 
        signal: controller.signal,
        // Critical for Next.js: prevent it from retrying failed requests indefinitely
        next: { revalidate: 1800 } 
      }
    );

    if (!response.ok) {
      console.error(`Weather API Error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    // Safety check for data structure
    if (!data.weather || !data.weather[0]) return null;

    return [
      { label: 'Météo', value: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1) },
      { label: 'Température', value: `${Math.round(data.main.temp)}°C` },
      { label: 'Vent', value: `${(data.wind.speed * 3.6).toFixed(1)} km/h` },
      { label: 'Visibilité', value: `${(data.visibility / 1000).toFixed(1)} km` },
      { label: 'Humidité', value: `${data.main.humidity}%` }
    ];
  } catch (error: any) {
    // Check if it's a timeout or a network block
    if (error.name === 'AbortError') {
      console.error('Weather request timed out (Jorf Lasfar)');
    } else {
      console.error('Weather network error (likely blocked by firewall/VPN)');
    }
    return null; 
  } finally {
    clearTimeout(timeoutId);
  }
}