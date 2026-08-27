<script setup>
import { provide } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from '@/components/weather/UnitToggler.vue'

provide('appTitle', 'Vue Weather Dashboard')

// [연습용] 빌드 모드(--mode)에 따라 로드되는 .env 파일의 값을 확인용으로 출력
// console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
</script>

<template>
  <div class="app-container">
    <header>
      <h1>종합실습 : Vue Weather Dashboard</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/faq">FAQ</RouterLink>
      </nav>
      <UnitToggler />
    </header>

    <RouterView />
  </div>
</template>
