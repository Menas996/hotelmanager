//模拟请求的接口数据

//导入mock对象
import Mock from 'mockjs'

//定义拦截的接口地址
Mock.mock('http://mockjs.com:83/Room/List', function() {
    //
    return Mock.mock({
        'data|20-30': [{
            "roomId|+1": 1000,
            roomType: {
                roomTypeName: "@ctitle(2,6)",
                "roomTypePrice|100-200": 200,
                "bedNum|1-2": 1,
            },
            roomState: {
                roomStateName: "@ctitle(2,6)"
            }
        }]
    })
})