
## 开发中必备的能力
-   代码开发量
-   开发复杂度
-   是否可调试以及调试难度

### 代码量
比native原生与我的话，要适应一下基础的环境。 目前支持的语法还是比较多的，有一些方式进行扩展。  
目前可预估的是代码量会稍大一些

### 开发复杂度
会高一点，主要在于一些特性在 `JSPatch` 中可能还不支持；  
还需要熟悉 `JSPatch` 环境以及复杂业务的开发流程；  
目前不建议使用 `JSPatch` 开发过多的逻辑，如果确实有需求，需要考虑多个 `js` 文件加载的情况；  

### 调试
`js` 中的 `console.log();` 会被打印在 `Xcode` 控制台（做了中转，相当于`NSLog`）  
**Debug**的话，需要使用 `Safari` 进行调试；[JS断点调试](https://github.com/bang590/JSPatch/wiki/JS-%E6%96%AD%E7%82%B9%E8%B0%83%E8%AF%95)  

*调试注意打开这个，不然有些js文件可能无法被正常加载。*  
![](http://blog.saick.net/HostedResources/Images/2016/JS-Debug.png)

