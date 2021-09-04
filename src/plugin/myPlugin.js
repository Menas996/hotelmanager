import {get, post, setToken } from "../utils/request"

//定义一个插件
export default {
    //插件中，必须包含一个install方法
    install: function(Vue) {
        //给Vue混入成员
        Vue.mixin({
            methods: {
                $get(url, params) {
                    return get(url, params)
                },
                $post(url, params) {
                    return post(url, params)
                },
                $setToken() {
                    //执行该方法，就会将浏览器缓存里面的token信息保存到ajax的请求头中
                    setToken()
                },
                //成功消息框
                $msg_s(message, duration = 3000) {
                    this.$message({
                        //显示关闭图标
                        showClose: true,
                        message,
                        type: 'success',
                        duration
                    })
                },
                //错误消息框
                $msg_e(message, duration = 3000) {
                    this.$message({
                        //显示关闭图标
                        showClose: true,
                        message,
                        type: 'error',
                        duration
                    })
                }
            },
        })
    }
}