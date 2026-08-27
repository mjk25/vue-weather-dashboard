<script setup>
const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])
</script>

<template>
  <input
    type="text"
    :value="props.currentQuery"
    placeholder="검색할 도시 이름 입력"
    @input="emit('update-query', $event.target.value)"
  />
</template>

<style scoped>
input {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #409eff;
}
</style>
