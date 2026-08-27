<script setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from '@/components/weather/BaseDashboardCard.vue'
import SearchBar from '@/components/weather/SearchBar.vue'
import WeatherCard from '@/components/weather/WeatherCard.vue'
import { fetchCurrentWeather } from '@/services/weatherApi'

const router = useRouter()

function goDetail(cityId) {
  router.push({ name: 'WeatherDetail', params: { cityId } })
}

// OpenWeatherMap 조회용 영문 도시명과 화면 표시용 정보
const cityMeta = [
  { id: 'city_01', name: '서울', query: 'Seoul,KR' },
  { id: 'city_02', name: '수원', query: 'Suwon,KR' },
  { id: 'city_03', name: '부산', query: 'Busan,KR' },
  { id: 'city_04', name: '제주', query: 'Jeju,KR' },
  { id: 'city_05', name: '강릉', query: 'Gangneung,KR' },
]

const weatherList = ref(
  cityMeta.map(({ id, name }) => ({ id, name, temp: 0, status: '불러오는 중...' })),
)

// 마운트 시점에 OpenWeatherMap에서 도시별 실제 날씨를 가져와 채워 넣습니다.
onMounted(() => {
  cityMeta.forEach(async (city, index) => {
    try {
      const weather = await fetchCurrentWeather(city.query)
      weatherList.value[index] = { id: city.id, name: city.name, ...weather }
    } catch (error) {
      console.error(`${city.name} 날씨 조회 실패:`, error)
      weatherList.value[index].status = '조회 실패'
    }
  })
})

const searchQuery = ref('')
const selectedCityInfo = ref('도시 카드를 선택해 보세요.')
const selectedCityId = ref(null)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(query))
})

// selectedCityInfo(상태바 문구)가 바뀔 때마다 콘솔에 기록합니다.
watch(selectedCityInfo, (message) => console.log('[watch] 상태바 문구 변경:', message))

// searchQuery(검색어)가 타이핑될 때마다 추적합니다.
watchEffect(() => {
  console.log('[watchEffect] 검색어:', searchQuery.value)
})
</script>

<template>
  <div class="weather-home">
    <BaseDashboardCard>
      <template #title><h2>도시 검색</h2></template>
      <SearchBar :current-query="searchQuery" @update-query="(value) => (searchQuery = value)" />
      <p v-if="searchQuery" class="search-hint">입력하신 도시명: "{{ searchQuery }}"</p>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #title><h2>지역별 날씨 현황</h2></template>

      <template v-if="filteredWeatherList.length > 0">
        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :city-item="city"
          :selected="city.id === selectedCityId"
          @select-card="
            (cityId, message) => {
              selectedCityId = cityId
              selectedCityInfo = message
            }
          "
          @click-detail="goDetail"
        />
      </template>
      <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<style scoped>
.weather-home {
  padding-bottom: 48px;
}

.status-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 26px 16px;
  background: #dcefce;
  border-top: 1px solid #dcdfe6;
  color: #313235;
  text-align: center;
}

.search-hint {
  margin: 8px 0 0;
  font-size: 0.9em;
  color: #909399;
}

</style>
