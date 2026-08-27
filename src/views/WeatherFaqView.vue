<script setup>
import { ref } from 'vue'

const faqList = ref([
  {
    question: '날씨 정보는 얼마나 자주 업데이트되나요?',
    answer: '메인 화면은 OpenWeatherMap API를 통해 접속할 때마다 실시간 날씨를 가져옵니다.',
    open: false,
  },
  {
    question: '섭씨/화씨 단위는 어떻게 바꾸나요?',
    answer: '상단의 단위 전환 버튼을 클릭하면 섭씨와 화씨를 바로 전환할 수 있습니다.',
    open: false,
  },
  {
    question: '검색 결과가 없다고 나와요.',
    answer: '등록된 도시명과 일치하는 검색어를 입력했는지 확인해 주세요.',
    open: false,
  },
])

function toggle(item) {
  item.open = !item.open
}
</script>

<template>
  <section>
    <h2>자주 묻는 질문</h2>

    <ul class="faq-list">
      <li v-for="item in faqList" :key="item.question" class="faq-item">
        <button class="faq-question" @click="toggle(item)">
          <span>{{ item.question }}</span>
          <span class="faq-icon">{{ item.open ? '−' : '+' }}</span>
        </button>
        <p v-if="item.open" class="faq-answer">{{ item.answer }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.faq-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.faq-item {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  margin-bottom: 10px;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border: none;
  background: white;
  color: #303133;
  font-size: 0.95em;
  text-align: left;
  cursor: pointer;
}

.faq-question:hover {
  color: #409eff;
}

.faq-icon {
  color: #909399;
}

.faq-answer {
  margin: 0;
  padding: 0 14px 12px;
  color: #606266;
}
</style>
