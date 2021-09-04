import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.use(ElementUI)
    //导入路由
import router from './router'
//导入状态管理
import store from './store'
//导入css规范的公共样式
import './assets/css/normalize.css'
//引入element ui样式文件


//导入插件
import './plugin'
// import './mock'

Vue.config.productionTip = false



new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')