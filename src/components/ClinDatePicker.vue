<script setup lang="ts">
import { dateFormat, DateFormatEnum, dateMask, dateValidate } from '@/utils'
import { ref, watch } from 'vue'
import { vMaska } from 'maska/vue'

const textFieldProps = defineProps<{
  label?: string
}>()

const model = defineModel<any>()
const date = ref<string>('')
const menu = ref<boolean>(false)

watch(
  () => model.value,
  () => {
    date.value = dateFormat(model.value, DateFormatEnum.FullDate.value)
  }
)

const handleInput = (e: any) => {
  date.value = e.target.value

  console.log(date.value)

  if (dateValidate(date.value, DateFormatEnum.FullDate.value)) {
    const americanDate = dateFormat(
      date.value,
      DateFormatEnum.FullDateAmerican.value,
      DateFormatEnum.FullDate.value
    )

    model.value = new Date(`${americanDate} 00:00:00`)
  }
}
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition">
    <template #activator="{ props }">
      <v-text-field
        v-bind="{ ...props, ...textFieldProps }"
        v-model="date"
        v-maska="dateMask"
        @input="handleInput"
      />
    </template>
    <v-date-picker v-model="model"></v-date-picker>
  </v-menu>
</template>

<style>
.v-overlay__content {
  pointer-events: none;
}

.v-overlay__content > * {
  pointer-events: all;
}
</style>
