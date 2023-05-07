import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@unocss/reset/normalize.css'
import 'virtual:uno.css'

import App from './App.vue'
import router from './router'

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
