> 控制缓存， 可配合支持promise的http插件使用，比如axios。

*重点说一下， xyios不需要后台配合，简单粗暴。如果配合axios，不破坏原来的任何功能*

### Usage

```
import xyios from 'xyios'

let http = xyios(axios, {
  cacheTime: 10, 
  MaxCacheLen: 1000, 
  filtMethods: ['post'],
})
```
Or jsonp   （支持后面加参数）（支持var和callback函数）
```
xyios({
  url: 'http://pv.sohu.com/cityjson',
  jsonp: true,
  val: 'returnCitySN'
}).then(e=>{
  console.log(e)
})
```

**配合axios和vue的实例**

main.js全局注入
```
import xyios from 'xyios'
import axios from 'axios'

Vue.prototype.$http = xyios(axios, {
  cacheTime: 10, 
  MaxCacheLen: 1000, 
})
```

### API

config
```
cacheTime // 缓存周期 默认是10s   单位是秒
MaxCacheLen // 最多缓存接口数 默认是1000条
filtMethods // 过滤不想要缓存的方法
```
jsonp

```
jsonp // true 调起jsonp模式
val 回调的值，链接字，看get接口里面的var的值，如果是函数也可以。
```

### 关于

*axios的interceptors拦截器请写带xyios的前面*


### LICENSE

MIT

