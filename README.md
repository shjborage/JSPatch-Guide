# JSPatch-Guide
[JSPatch](https://github.com/bang590/JSPatch) 调研笔记与使用教程  

### 技术选型
目前项目考虑热更新一些功能，就想到Hotfix的`JSPatch`，这个现在和基于 `lua` 的 [Wax](https://github.com/alibaba/wax)以及[WaxPatch](https://github.com/mmin18/WaxPatch) 思路应该类似。  

基于以下几个原因，选择研究 `JSPatch`：  
1. 之前在调研 [React-Native](https://github.com/ReactNativeGuide)  
2. 目前在学习 `Javascript` 学习地址: [FreeCodeCamp](https://www.freecodecamp.com)  
3. iOS7以后系统内建支持 `Javascript`（JavaScriptCore.framework）  
4. 使用 `lua` 也无法与 `Android` 端通用（都是映射相应的native方法的）  

### 调研方案
目前仅仅对 `JSPatch` 有了初步的了解，后续的主要研究方向为：  
1. 基础原理（js与oc通信原理以及patch原理等）  
2. 接口扩展以及使用三方库，比如网络库  
3. 降级方案及详细策略  
4. 开发可能会遇到的问题  

### 常用工具
OC代码转换为JS代码工具：<http://bang590.github.io/JSPatchConvertor/>  
JS代码压缩工具：<http://tool.css-js.com/>  

### 具体调研细节
-   [**JavaScriptCore** 调研](/JavaScriptCore/JSCGuide.md)
-   [**JSPatch** Detail 调研](/JSPatchDetail/JSPatchDetail.md)
-   [**实际开发调研**](/DevelopDemo/DevelopDemo.md)

### 常见问题与解答 Q&A
##### 1. 重写的方法与原来的类型不对报错怎么办？
建议仔细看下作者写的替换的[原理](https://github.com/bang590/JSPatch/wiki/JSPatch-%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86%E8%AF%A6%E8%A7%A3)，本身是没有问题的。  
目前不需要怀疑JSPatch的原理以及本身的问题，先检查一下重写原有方法的参数类型与你要重写的是否一致，一定要仔细检查，不要想当然。
##### 2. 我新写了一个 `UITableViewCell`，为啥设置 `selectionStyle` 不管用？
这个比较搞笑，确切的说是个小坑。 因为你在cell的js代码中写 `self.selectionStyle = 0` 相当于设置了没有点击态，但实际上这个并没有被调用到oc中。 正确的写法应该是: `self.setSelectionStyle(0);`
##### 3. 使用压缩工具压缩后，语法错误怎么破？
首先应该选择合适的工具，比如：[Google Closure Compiler](http://closure-compiler.appspot.com/home) 工具应该倒也不是重点，重点还是工具会把一些 `'xx'` 转换为 `"xx"`，这与 `JSPatch` 的方法调用替换 `__c("xx")` 是有冲突的，这就会带来问题了。
```
console.log('aModel:' + aModel + 'aModel.daoDianfu():' + aModel.daoDianfu());
```
被转换为
```
console.__c("log")("aModel:"+aModel+"aModel.__c("daoDianfu")():"+aModel.__c("daoDianfu")()),
```
另外，这个 `self` `new` 被搞坏的情况也值得注意：
```
// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

self.super();
a.new();
```
被转换为
```
self["super"]();a["new"]();
```
##### 4. NSNumber使用
不能使用 `NSNumber` 的 `alloc` 方法，但可以使用一些类方法。  
与 `setProp_forKey` 一起使用时要注意，`NSNumber` 在js会面取到时，会变成普通数字，直接判断即可。_