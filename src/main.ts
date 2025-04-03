import { createApp } from 'vue'
import '@/styles/index.scss'
import "@/assets/fonts/font.scss";//字体
import router from "@/routers/index";
// import DataVVue3 from '@kjgl77/datav-vue3'
import zBorder from '@/components/z-border/index.vue'
import zSort from '@/components/z-sort/index.vue'
import zCard from '@/components/z-card/index.vue'
import zCardData from '@/components/z-card-data/index.vue'
import BaiduMap from 'vue-baidu-map-3x';



import pinia from "@/store/index";
import App from './App.vue'
const app = createApp(App);
app.component('z-border', zBorder)
    .component('z-sort', zSort)
    .component('z-card', zCard)
    .component('z-card-data', zCardData)
    // .use(router).use(DataVVue3).use(pinia)
    .use(router)
    // .use(DataVVue3)
    .use(pinia)
    .use(BaiduMap, {
        // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
        ak: 'X64A801NOTXUBt5s0xRGLKkwWhikAS8v',
        // v:'2.0',  // 默认使用3.0
        // type: 'WebGL' // ||API 默认API  (使用此模式 BMap=BMapGL)
    })
    .mount('#app')
