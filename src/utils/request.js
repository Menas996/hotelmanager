//请求相关的方法
import axios from 'axios'
//导入nprogress加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//导入BASE_URL
import { BASE_URL } from '../config/index'

//初始化一个axios对象
var instance = axios.create({
    //接口地址根路径
    baseURL: BASE_URL,
    //超时事件
    timeout: 2000,
});

let get = async function(url, params) {
        const { data } = await instance.get(url, { params })
        return data;
    }
    //创建一个post请求方法
let post = async function(url, params) {
    const { data } = await instance.post(url, params)
    return data;
}

//创建一个将token信息保存到请求头的方法
let setToken = function() {
    instance.defaults.headers.common['token'] = sessionStorage.getItem('token');
}

//添加请求拦截器
instance.interceptors.request.use(
    function(config) {
        //再发送请求之前做什么
        NProgress.start()
        return config;
    },
    function(err) {
        NProgress.done()
        return Promise.reject(err)
    }
)

//添加响应拦截器
instance.interceptors.response.use(
        function(response) {
            //对响应数据做点什么
            NProgress.done()
            return response;
        },
        function(err) {
            NProgress.done()
            return Promise.reject(err)
        }
    )
    //导出get和post方法
export {
    get,
    post,
    setToken
}