<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <section class="not-found">
    <h1>404</h1>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <button @click="router.push({ name: 'WeatherHome' })">홈으로 이동</button>
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
