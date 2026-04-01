import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import router from '@/router'
import 'normalize.css/normalize.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import "@/styles/theme/base.css";
import "@/styles/theme/dark.css";
import "@/styles/element/index.css";
import "@/styles/layout/index.css";
import "@/styles/md/default.scss"



const app = createApp(App)
const head = createHead()

app.use(router)
app.use(head)
app.mount('#app')
