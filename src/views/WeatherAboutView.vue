<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const appTitle = inject('appTitle', 'Weather Dashboard')
const router = useRouter()
</script>

<template>
  <section>
    <h2>날씨 서비스 소개</h2>
    <h3>P108 김민주</h3>
    <p>
      <strong>{{ appTitle }}</strong
      >는 Vue 3 학습을 위한 실습 프로젝트입니다.
    </p>
    <p>Vue Router, Pinia, Axios, Element Plus를 하나의 SPA에서 연결합니다.</p>
    <button @click="router.push({ name: 'WeatherHome' })">메인 대시보드로 돌아가기</button>
  </section>
</template>
