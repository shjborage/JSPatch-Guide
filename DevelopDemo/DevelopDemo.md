
## 开发中必备的能力
-   代码开发量
-   开发复杂度
-   是否可调试以及调试难度
-   资源文件的使用
-   多模块（多文件支持）支持

*要解决以上问题，还是先看官方文档* :[JSPatch 基础用法](https://github.com/bang590/JSPatch/wiki/JSPatch-%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95)

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
-   对 `NSString` 类型的使用，也会有一些坑 详情如下：`var dataDesc = require('NSString').string().stringByAppendingString(self.dataObject().description()).stringByAppendingString(' Test');` 这样的写法是ok的，但如果这样写 `self.dataLabel().setText(self.dataObject().description() + "Test");` 就不行了。 所以你懂的，得分清你在写什么代码。
-   动态加载系统库
> 对于 iOS 内置的动态库，若原 APP 里没有加载，可以通过以下方式动态加载，以加载 SafariServices.framework 为例：
> ```
> var bundle = NSBundle.bundleWithPath("/System/Library/Frameworks/SafariServices.framework");
> bundle.load();
> ```
-   枚举、宏这些都不能在js中直接使用，需要转换成相应的“值”

### 调试
-   `js` 中的 `console.log();` 会被打印在 `Xcode` 控制台（做了中转，相当于`NSLog`）  
-   **Debug**的话，需要使用 `Safari` 进行调试；[JS断点调试](https://github.com/bang590/JSPatch/wiki/JS-%E6%96%AD%E7%82%B9%E8%B0%83%E8%AF%95)
*调试注意打开这个，不然有些js文件可能无法被正常加载。*  
![](http://blog.saick.net/HostedResources/Images/2016/JS-Debug.png)
  
### 资源文件使用
-   测试使用 `require('UIImage').imageNamed('TestImage')` 是可以取到 `Assets.xcassets` 中的图片
-   使用 `bundle` 取图片只测试了一下 `mainBunle` 其它应该也是一样的，也是可以取到图片 `require('UIImage').imageWithContentsOfFile(require('NSBundle').mainBundle().pathForResource_ofType("TestImage", 'png'))`

### 使用注意事项
#### 更新频率
>我之前看到很多人把使用js和下载js的代码都放在了didFinishLaunchingWithOptions：这个方法。我觉得有所不妥，因为如果这个app用户一直放在手机的后台（比如微信），并且也没出现内存警告的话，这个方法应该一直不会调用。我建议的是：使用js文件的代码放在didFinishLaunchingWithOptions： 而下载js文件的代码放在applicationDidBecomeActive: 因为这个方法在程序启动和后台回到前台时都会调用。并且我建议设置一个间隔时间，根据一些数据和权衡之后我们采用的是间隔时间设为1小时。 也就是说每次来到这个方法时，先要检测是距离上次发请求的时间间隔是否超过1小时，超过则发请求，否则跳过。

#### JSON与模型处理
如果使用 `JSONModel` 或 `Mantle` 等model转json的库，model升级需要注意 *property* 的使用。  
对于 **新增property**，关联对象（`objc_getAssociatedObject` 与 `objc_setAssociatedObject`）是常见的用法，但这种做法不会被 `JSONModel` 等用 `class_copyPropertyList` 来实现的json转model的库来发现新的property。
需要使用 `class_addProperty` 来添加property。使用这种技术方案的话，需要了解各种 `objc_property_attribute_t`，详细的[苹果官方文档](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtPropertyIntrospection.html)。除此之外，类似[这个问题](http://stackoverflow.com/questions/7819092/how-can-i-add-properties-to-an-object-at-runtime)，有人给出了这个答案，大概的解法如下：
```
#include <objc/runtime.h>
#import <Foundation/Foundation.h>

@interface SomeClass : NSObject {
    NSString *_privateName;
}
@end

@implementation SomeClass
- (id)init {
    self = [super init];
    if (self) _privateName = @"Steve";
    return self;
}
@end

NSString *nameGetter(id self, SEL _cmd) {
    Ivar ivar = class_getInstanceVariable([SomeClass class], "_privateName");
    return object_getIvar(self, ivar);
}

void nameSetter(id self, SEL _cmd, NSString *newName) {
    Ivar ivar = class_getInstanceVariable([SomeClass class], "_privateName");
    id oldName = object_getIvar(self, ivar);
    if (oldName != newName) object_setIvar(self, ivar, [newName copy]);
}

int main(void) {
    @autoreleasepool {
        objc_property_attribute_t type = { "T", "@\"NSString\"" };
        objc_property_attribute_t ownership = { "C", "" }; // C = copy
        objc_property_attribute_t backingivar  = { "V", "_privateName" };
        objc_property_attribute_t attrs[] = { type, ownership, backingivar };
        class_addProperty([SomeClass class], "name", attrs, 3);
        class_addMethod([SomeClass class], @selector(name), (IMP)nameGetter, "@@:");
        class_addMethod([SomeClass class], @selector(setName:), (IMP)nameSetter, "v@:@");

        id o = [SomeClass new];
        NSLog(@"%@", [o name]);
        [o setName:@"Jobs"];
        NSLog(@"%@", [o name]);
    }
}
```
这个解法看似简单，但有几个需要注意的问题  
1. 需要单独调用 `class_addMethod` 来添加 `getter` 与 `setter`；  
2. 例子 `nameGetter` `nameSetter`中很多参数都是写死的，对于内存管理、是否线程安全，都需要从 `self` `_cmd` 这俩参数中获取，因为你添加的所有property都是这个俩 `getter` `setter`  
3. property对应的内部实例变量，例子中也是**提前声明**好的。实际上根据官方文档以及[这个博客](http://southpeak.github.io/blog/2014/10/25/objective-c-runtime-yun-xing-shi-zhi-lei-yu-dui-xiang/)里的说明，`class_addIvar` 这个方法只能在 `objc_allocateClassPair` 函数与 `objc_registerClassPair` 之间调用。也就是说只能自己通过 runtime 添加的类才可以添加实例变量。  

根据上面3个问题，所以还要在 `class_addProperty` 结合 `class_addMethod` 以及*关联对象*来完成一个新的property的添加。  
完整的扩展后续会开源出来。

除此之外，`JSONModel`还有一些细节使用，比如`@property (nonatomic, strong) NSArray<Optional, xxJSONModel> *recommend;` 需要注意添加property时的变量类型以及相应的protocal。 这种新增的话需要注意以下几点：  
1. 新增的 `xxJSONModel` 要注意继承 `JSONModel`；  
2. 需要注意property里protocal的使用  

#### 代码冲突问题
如果你有代码冲突的问题，当然这个我觉得比较扯，可以通过类似混淆的方式来修改 `symbol` 的方式来解决，参考这个 <http://blog.sigmapoint.pl/avoiding-dependency-collisions-in-ios-static-library-managed-by-cocoapods/>
还有一个方案就是将只使用 `Core` 部分（修改下类名等），其它部分由自己来实现。

#### 参考JS下发流程
官方的做法见这两个说明：
[JSPatch 部署安全策略](http://blog.cnbang.net/tech/2879/)  
[JSPatch Loader 使用文档](https://github.com/bang590/JSPatch/wiki/JSPatch-Loader-%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3)  

其它小伙伴给出的流程：
![](http://blog.saick.net/HostedResources/Images/2016/jspatch_1.png)
![](http://blog.saick.net/HostedResources/Images/2016/jspatch_2.png)

#### JS文件压缩
压缩工具：<http://tool.css-js.com/>  
支持各种压缩引擎，亲测 JSPatch 对 [Uglify](http://lisperator.net/uglifyjs/) 支持较好，或者说这个工具比较适配 JSPatch。 注意要关闭这个选项：`删除没使用的变量、函数`，原因是 OC 与 JS 各种互相调用，很有可能在 JS 中未使用。


### 使用 JSPatch 开发功能模块
如果使用 `JSPatch` 开发全新的模块，多看看这个[官方的说明](https://github.com/bang590/JSPatch/wiki/%E4%BD%BF%E7%94%A8-JSPatch-%E5%BC%80%E5%8F%91%E5%8A%9F%E8%83%BD%E6%A8%A1%E5%9D%97)

## REF
[JSPatch 常见问题](https://github.com/bang590/JSPatch/wiki/JSPatch-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)  
[JSPatch 使用小记](http://www.cnblogs.com/dsxniubility/p/5080875.html)  
[JSPatch 实现原理详解](https://github.com/bang590/JSPatch/wiki/JSPatch-%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86%E8%AF%A6%E8%A7%A3)  