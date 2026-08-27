<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { findCityById } from '@/data/cities'
import { fetchCurrentWeather } from '@/services/weatherApi'

const route = useRoute()
const router = useRouter()

const cityData = ref(null)
const loading = ref(true)
const errorMessage = ref('')

// cityData가 로딩되기 전에도 안전하게 0을 넘기고, 로딩 후 실제 섭씨 값을 전달합니다.
const { displayTemp, unitSymbol } = useTemperature(() => cityData.value?.temp ?? 0)

// OpenStreetMap 임베드 URL. 좌표 주변으로 작은 bbox를 만들고 마커를 찍습니다.
const mapSrc = computed(() => {
  if (!cityData.value) return ''
  const { lat, lon } = cityData.value
  const d = 0.05
  const bbox = [lon - d, lat - d, lon + d, lat + d].join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
})

const mapLink = computed(() => {
  if (!cityData.value) return ''
  const { lat, lon } = cityData.value
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`
})

// 마운트 시점에 URL의 cityId로 실제 날씨를 조회합니다.
onMounted(async () => {
  const city = findCityById(String(route.params.cityId))
  if (!city) {
    errorMessage.value = '등록되지 않은 도시입니다.'
    loading.value = false
    return
  }

  try {
    const weather = await fetchCurrentWeather(city.query)
    cityData.value = { name: city.name, ...weather }
  } catch (error) {
    console.error(`${city.name} 상세 날씨 조회 실패:`, error)
    errorMessage.value = '날씨 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <h2>상세 날씨</h2>

    <p v-if="loading">불러오는 중...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <div v-else-if="cityData" class="detail-body">
      <div class="detail-info">
        <h3>{{ cityData.name }}</h3>
        <p>기온: {{ displayTemp }}{{ unitSymbol }}</p>
        <p>날씨: {{ cityData.status }}</p>
        <p>습도: {{ cityData.humidity }}%</p>
        <p>풍속: {{ cityData.wind }}m/s</p>
      </div>

      <div class="detail-map">
        <iframe
          :src="mapSrc"
          title="위치 지도"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        <a :href="mapLink" target="_blank" rel="noopener">큰 지도 보기 ↗</a>
      </div>
    </div>

    <button @click="router.push('/')">홈으로 돌아가기</button>
  </section>
</template>

<style scoped>
.detail-body {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.detail-info {
  flex: 1 1 200px;
}

.detail-map {
  flex: 1 1 320px;
  max-width: 480px;
}

.detail-map iframe {
  width: 100%;
  height: 300px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.detail-map a {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.9em;
  color: #409eff;
}

button {
  margin-top: 20px;
  padding: 8px 12px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  color: white;
  cursor: pointer;
}
</style>
