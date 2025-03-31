<script setup lang="ts">
import { useToastStore } from '@/stores'

const toastStore = useToastStore()
</script>

<template>
  <div class="notification-container">
    <v-slide-y-transition group>
      <v-alert
        v-for="message in toastStore.messages"
        :key="message.text"
        :color="message.type"
        :elevation="12"
      >
        <div v-html="message.text"></div>
      </v-alert>
    </v-slide-y-transition>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-gap: 0.5em;
  z-index: 9999;
}

.notification-container:deep(a) {
  color-scheme: dark;
  color: inherit;
}
</style>
