
## 开发中必备的能力
-   代码开发量
-   开发复杂度
-   是否可调试以及调试难度
-   资源文件的使用

### 代码量
-   比native原生与我的话，要适应一下基础的环境。 目前支持的语法还是比较多的，有一些方式进行扩展。  
-   目前可预估的是代码量会稍大一些，根据[JSPatch 常见问题](https://github.com/bang590/JSPatch/wiki/JSPatch-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)中的描述，很多类型转换会增加工作量和复杂度。

### 开发复杂度
整体会高一些，目前不建议使用 `JSPatch` 开发过多的逻辑，如果确实有需求，需要考虑多个 `js` 文件加载的情况；  

-   一些特性在 `JSPatch` 中可能还不支持；  
-   需要熟悉 `JSPatch` 环境以及复杂业务的开发流程；    
-   字符串 / 数组 / 字典 操作的话，因为 `oc` 与 `js` 中都有相应的类型，使用上需要特别注意
-   各种api都需要背下来进行开发，时间成本会变高
-   对 `property` 的使用需要注意，不能使用 *dot语法*，需要使用 *get set方法* 来做

### 调试
-   `js` 中的 `console.log();` 会被打印在 `Xcode` 控制台（做了中转，相当于`NSLog`）  
-   **Debug**的话，需要使用 `Safari` 进行调试；[JS断点调试](https://github.com/bang590/JSPatch/wiki/JS-%E6%96%AD%E7%82%B9%E8%B0%83%E8%AF%95)
  
### 资源文件使用
-   测试使用 `require('UIImage').imageNamed('TestImage')` 是可以取到 `Assets.xcassets` 中的图片
-   使用 `bundle` 取图片只测试了一下 `mainBunle` 其它应该也是一样的，也是可以取到图片 `require('UIImage').imageWithContentsOfFile(require('NSBundle').mainBundle().pathForResource_ofType("TestImage", 'png'))`

*调试注意打开这个，不然有些js文件可能无法被正常加载。*  
![](http://blog.saick.net/HostedResources/Images/2016/JS-Debug.png)

### 代码冲突问题
如果你有代码冲突的问题，当然这个我觉得比较扯，可以通过类似混淆的方式来修改 `symbol` 的方式来解决，参考这个 <http://blog.sigmapoint.pl/avoiding-dependency-collisions-in-ios-static-library-managed-by-cocoapods/>
还有一个方案就是将只使用 `Core` 部分（修改下类名等），其它部分由自己来实现。

## REF
[JSPatch 常见问题](https://github.com/bang590/JSPatch/wiki/JSPatch-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
