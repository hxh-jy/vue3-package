import { createApp } from 'vue'
import App from './App.vue'
import ShareContent from 'share-content'
let app = createApp(App)
app.use(ShareContent)
app.mount('#app')
