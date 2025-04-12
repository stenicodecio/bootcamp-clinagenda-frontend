import App from './App.vue'
import { createApp } from 'vue'
import vuetify from '@/engine/vuetify'
import router from '@/router'
import { createPinia } from 'pinia'
import makeServer from './engine/mock'

const app = createApp(App)

// Mock server
if (import.meta.env.VITE_USE_MOCK === 'true') {
  makeServer()
}

// Register plugins
const pinia = createPinia()
app.use(vuetify).use(router).use(pinia)

app.mount('#app')
