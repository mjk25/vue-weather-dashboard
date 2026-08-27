import axios from 'axios'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// 도시 이름(예: 'Seoul,KR')으로 현재 날씨를 조회합니다.
// units=metric: 섭씨로 반환, lang=kr: 날씨 설명을 한글로 반환
export async function fetchCurrentWeather(cityQuery) {
  const { data } = await axios.get(BASE_URL, {
    params: {
      q: cityQuery,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return {
    temp: Math.round(data.main.temp),
    status: data.weather[0].description,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    lat: data.coord.lat,
    lon: data.coord.lon,
  }
}
