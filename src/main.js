import { createApp } from 'vue'
import App from './App.vue'
import ShareContent from 'share-content'
import 'share-content/share-content.css'
let app = createApp(App)
app.use(ShareContent)
app.mount('#app')
