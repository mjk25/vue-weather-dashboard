<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'

const route = useRoute()
const router = useRouter()
const cityData = ref(null)

// cityData가 로딩되기 전에도 안전하게 0을 넘기고, 로딩 후 실제 섭씨 값을 전달합니다.
const { displayTemp, unitSymbol } = useTemperature(() => cityData.value?.temp ?? 0)

const mockDetails = {
  city_01: { name: '서울', temp: 28, status: '맑음', humidity: 55, wind: 2.5 },
  city_02: { name: '수원', temp: 24, status: '비', humidity: 85, wind: 4.1 },
  city_03: { name: '부산', temp: 26, status: '구름', humidity: 65, wind: 5.0 },
  city_04: { name: '제주', temp: 30, status: '맑음', humidity: 70, wind: 3.2 },
  city_05: { name: '강릉', temp: 22, status: '흐림', humidity: 60, wind: 2.8 },
}

// 컴포넌트가 화면에 연결된 뒤 URL의 cityId를 읽습니다.
onMounted(() => {
  cityData.value = mockDetails[String(route.params.cityId)] ?? null
})
</script>

<template>
  <section>
    <h2>상세 날씨</h2>
    <div v-if="cityData">
      <h3>{{ cityData.name }}</h3>
      <p>기온: {{ displayTemp }}{{ unitSymbol }}</p>
      <p>날씨: {{ cityData.status }}</p>
      <p>습도: {{ cityData.humidity }}%</p>
      <p>풍속: {{ cityData.wind }}m/s</p>
    </div>
    <button @click="router.push('/')">홈으로 돌아가기</button>
  </section>
</template>

<style scoped>
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
