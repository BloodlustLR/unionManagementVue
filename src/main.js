import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './plugins/axios'
import jsCookie from './plugins/cookies'
import 'animate.css'
import './reset.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


createApp(App).use(store).use(router).use(request).use(ElementPlus, {locale: zhCn}).use(jsCookie).mount('#app')