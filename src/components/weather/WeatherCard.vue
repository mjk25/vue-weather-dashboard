<script setup>
import { useTemperature } from '@/composables/useTemperature'

const props = defineProps({
  cityItem: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['select-card', 'click-detail'])

// 부모가 넘겨준 섭씨 값을 Composable에 전달합니다.
const { displayTemp, unitSymbol } = useTemperature(() => props.cityItem.temp)
</script>

<template>
  <article
    class="weather-card"
    :class="{ 'is-selected': props.selected }"
    @click="emit('select-card', props.cityItem.id, `${props.cityItem.name}이 선택되었습니다.`)"
  >
    <h3>{{ props.cityItem.name }}</h3>
    <p>현재 기온: {{ displayTemp }}{{ unitSymbol }}</p>
    <p>날씨: {{ props.cityItem.status }}</p>
    <p v-if="props.cityItem.humidity">습도: {{ props.cityItem.humidity }}%</p>

    <span v-if="props.cityItem.temp >= 25" class="badge badge--hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge badge--cool">❄️ 선선함 (25도 미만)</span>

    <button @click.stop="emit('click-detail', props.cityItem.id)">상세보기</button>
  </article>
</template>

<style scoped>
.weather-card {
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.weather-card:hover {
  border-color: #c0c4cc;
  background: #fafbfc;
}

.weather-card.is-selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.weather-card h3 {
  margin: 0 0 8px;
}

.weather-card p {
  margin: 4px 0;
  color: #606266;
}

.badge {
  display: inline-block;
  margin-top: 6px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
}

.badge--hot {
  background: #fdf6ec;
  color: #e6a23c;
}

.badge--cool {
  background: #ecf5ff;
  color: #409eff;
}

button {
  margin-top: 10px;
  padding: 6px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: white;
  color: #303133;
  font-size: 0.9em;
  cursor: pointer;
}

button:hover {
  border-color: #409eff;
  color: #409eff;
}
</style>
