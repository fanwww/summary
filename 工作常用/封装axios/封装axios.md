## 第一步:封装request文件

```javascript
// 封装axios请求函数

import $http from 'axios'
import qs from 'qs'
// import { Loading } from 'element-ui'  使用elemen-ui组件
// import { Toast } from 'vant'  使用vant组件

var host
if (process.env.NODE_ENV == 'development') {
    //当前处于开发模式
    host = ''
} else {
    //当前处于生产模式
    host = ''
}

//创建一个axios实例对象
const instance = $http.create({
    //配置默认地址头和请求超时时间
    baseURL: host,
    timeout: 5 * 1000
})

//配置该实例对象的拦截器

// 声明加载动画
var loading
    //配置请求拦截器
instance.interceptors.request.use(
    config => {
        if (config.method.toLocaleLowerCase() == 'post') {
            config.data = qs.stringify(config.data)
        }
        
        //element-ui启动加载动画
        //loading = Loading.service({
            //lock: true,
            //text: 'Loading',
            //spinner: 'el-icon-loading',
            //background: 'rgba(0, 0, 0, 0.7)'
        //});
     
        
        //vnat启动加载动画
        //loading = Toast.loading({
            //message: '加载中...',
            //forbidClick: true,
        //});
        
        return config
    }, res => {
        return Promise.reject(res)
    }
)



//配置相应拦截器
instance.interceptors.response.use(
    response => {
        
        //element-ui结束加载动画
        //loading.close()
        
        //vant结束加载动画
        //loading.clear()
        
        return response
    }, res => {
        return Promise.reject(res)
    }
)



//封装成函数使用
function request(url, method, data) {
    return instance({
        url,
        method,
        [method.toLocaleLowerCase() == 'get' ? 'params' : 'data']: data
    })
}



//导出封装好的函数

export default request
```

## 第二步:二次封装导出使用的api

```javascript
//API名字


//导入封装好的axios函数

import request from '@/api/' //引入request文件


//api功能

function name(参数) {

  return request('路径', 'post', 参数)

}



export {

  name

}
```

