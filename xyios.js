/**
 * XXY is open source and released under the MIT Licence.
 * Copyright (c) 2017 xiexiuyue
 * email : abc_xf@126.com
 **/
export default (http, param) => {
    let arr = []
        , config

    // default
    config = {
        cacheTime: 5, // s
        MaxCacheLen: 2000,
    }
    param || (param = {})

    return a => {
        let url = a.url ? a.url : a
            , createScript, createAjax
            , runningCache = false // 开启缓存
            , runningJsonp = a.jsonp ? true : false  // 执行native ajax
            , add // 请求成功后保存数据
            , del // 回收无用数据
            , oldval // 匹配若成功，返回(http、jsonp)缓存, 只返回缓存
            , clear // 清除缓存

        // import default params detection
        // TODO ...
        // import default config
        Object.assign(config, param);
        // exec default config
        config.clearCache && clear()
        if (config.MaxCacheLen && arr.length >= config.MaxCacheLen) {
            arr.splice(arr.length - 1, 100)
        }
        // Matching successfully reads the cache
        arr.map(e => {
            if (e.url == url && (+new Date - e.t) / 1000 < config.cacheTime) {
                runningCache = true
                oldval = e.val
            }
        })
        // add done cache
        add = o => {
            del(url)
            arr.push({
                url,
                t: +new Date,
                val: o.val,
            })
        }
        // delete old cache
        del = url => {
            arr.map((e, i, arr) => {
                if (e.url == url) {
                    arr.splice(i, 1)
                }
            })
        }
        // execute jsonp
        createScript = (resolve, reject) => {
            // debugger
            try {
                let vKey = a.val
                    , script = document.createElement("script")
                    , head = document.getElementsByTagName("head")[0]
                    , windowOldVal = window[vKey] // save golbal var
                    , load = ()=> {
                        script.parentNode.removeChild(script)
                        script = null
                        resolve(window[vKey])
                        window[vKey] = windowOldVal // recover global var
                    }
                    
                script.src = `${url}?var=${vKey}`
                script.addEventListener('load', load)
                head.appendChild(script)
                
            } catch (error) {
                reject(error)
            }
        }
        // execute ajax
        createAjax = (resolve, reject) => {
            // TODO
            // ...
            resolve({ data: {} })
        }
        // clear cache
        clear = url => {
            url ? del(url) : arr = []
        }
        return new Promise((resolve, reject) => {
            switch (true) {
                // Intercepts and returns the cache
                case runningCache: {
                    resolve(oldval)
                    break
                }
                // Intercepts and execute jsonp func
                case runningJsonp: {
                    createScript(resolve, reject)
                    break
                }
                // open promist type http request 
                default: {
                    if (!http) {
                        // createAjax.apply(null, [].slice.call(arguments))
                        createAjax(resolve, reject)
                    } else {
                        http(a).then(e => {
                            add({
                                val: e
                            })
                            resolve(e)
                        }).catch(e => {
                            reject(e)
                        })
                    }
                }
            }

        })
    }

}
