import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'boxicons/css/boxicons.min.css'
import Toast from 'vue-toastification'  // Importamos la librería de toasts
import 'vue-toastification/dist/index.css'  // Importamos los estilos de los toasts

createApp(App)
  .use(store)
  .use(router)
  .use(Toast)  // Registramos Vue Toastification
  .mount('#app')
