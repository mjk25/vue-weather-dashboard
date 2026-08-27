// 화면 표시용 정보와 OpenWeatherMap 조회용 영문 도시명을 한곳에서 관리합니다.
export interface CityMeta {
  id: string
  name: string
  query: string
}

export const cityMeta: CityMeta[] = [
  { id: 'city_01', name: '서울', query: 'Seoul,KR' },
  { id: 'city_02', name: '수원', query: 'Suwon,KR' },
  { id: 'city_03', name: '부산', query: 'Busan,KR' },
  { id: 'city_04', name: '제주', query: 'Jeju,KR' },
  { id: 'city_05', name: '강릉', query: 'Gangneung,KR' },
]

export const validCityIds = new Set(cityMeta.map((city) => city.id))

export function findCityById(cityId: string): CityMeta | null {
  return cityMeta.find((city) => city.id === cityId) ?? null
}
