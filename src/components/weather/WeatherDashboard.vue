<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  // 직접 추가한 데이터: 습도(humidity) 필드를 새로 넣어 카드 목업에 반영
  { id: 'city_04', name: '제주', temp: 30, status: '맑음', humidity: 70 },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림', humidity: 60 },
])

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

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// --- 본인만의 반응형 상태 / computed / watcher ---
const favoriteCity = ref('')

const favoriteCityInfo = computed(() => {
  const query = favoriteCity.value.trim()
  if (!query) return null
  return weatherList.value.find((city) => city.name === query) ?? null
})

watch(favoriteCity, (newName) => {
  console.log('[watch] 즐겨찾기 도시 변경:', newName)
})
</script>

<template>
  <div>
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
          @click-detail="showDetail"
        />
      </template>
      <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #title><h2>즐겨찾기 도시</h2></template>
      <input
        type="text"
        class="favorite-input"
        :value="favoriteCity"
        placeholder="즐겨찾을 도시 이름 입력"
        @input="favoriteCity = $event.target.value"
      />
      <p v-if="!favoriteCity" class="no-result">즐겨찾을 도시 이름을 입력해 보세요.</p>
      <p v-else-if="favoriteCityInfo" class="favorite-result">
        {{ favoriteCityInfo.name }}의 현재 날씨: {{ favoriteCityInfo.status }} /
        {{ favoriteCityInfo.temp }}℃
      </p>
      <p v-else class="no-result">'{{ favoriteCity }}' 도시를 찾을 수 없습니다.</p>
    </BaseDashboardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<style scoped>
.search-hint {
  margin: 8px 0 0;
  font-size: 0.9em;
  color: #909399;
}

.favorite-input {
  padding: 8px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 0.95em;
  width: 100%;
  max-width: 260px;
}

.favorite-input:focus {
  outline: none;
  border-color: #409eff;
}

.favorite-result {
  margin-top: 10px;
  color: #606266;
}

.no-result {
  color: #909399;
}
</style>
