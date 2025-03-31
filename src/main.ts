import App from './App.vue'
import { createApp } from 'vue'
// import { makeServer } from './engine/mock'
import vuetify from '@/engine/vuetify'
import router from '@/router'
import { createPinia } from 'pinia'
// import { vMaska } from 'maska/vue'

const app = createApp(App)

// Mock server
// if (import.meta.env.MODE === 'development') {
//   makeServer()
// }

// Register plugins
const pinia = createPinia()
app.use(vuetify).use(router).use(pinia)

app.mount('#app')
