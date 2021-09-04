//注册element ui组件库
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)


import VueQuillEditor from 'vue-quill-editor'

// require styles富文本编辑器插件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)



//注册myPlugin组件
import myPlugin from './myPlugin'
Vue.use(myPlugin)