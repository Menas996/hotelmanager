//当前登录账户模块
export default {
    //设置为私有命名空间
    namespaced: true,
    state: {
        admin: {}
    },
    mutations: {
        //该方法，用于对admin对象赋值
        setAdmin(state, val) {
            return state.admin = val
        }
    }
}