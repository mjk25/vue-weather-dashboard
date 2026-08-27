<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div>
    <span>현재 단위: {{ configStore.unitSymbol }}</span>

    <el-tooltip content="섭씨(℃) ↔ 화씨(℉)를 전환합니다" placement="bottom">
      <button @click="configStore.toggleUnit">단위 변경</button>
    </el-tooltip>
  </div>
</template>

<style scoped>
span {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  font-size: 16px;
}

button {
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  background: #fafbfc;
  border-color: #969696;
  border-radius: 6px;
}

button:hover {
  border-color: #c0c4cc;
  background: #80868c;
  color: #f1f5f6;
}
</style>
