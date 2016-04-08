## 准备工作
先通过 `git submodule` 把代码拉下来。。。  
非常重要的是作者写的文档 [JSPatch 实现原理详解](https://github.com/bang590/JSPatch/wiki/JSPatch-%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86%E8%AF%A6%E8%A7%A3)

### 一些基本原理
####  `console.log` 中转的实现
在 `JPEngine` 启动后，调用了以下代码在 `js` 添加 `_OC_log` 来打log到Xcode控制台：
```
    context[@"_OC_log"] = ^() {
        NSArray *args = [JSContext currentArguments];
        for (JSValue *jsVal in args) {
            id obj = formatJSToOC(jsVal);
            NSLog(@"JSPatch.log: %@", obj == _nilObj ? nil : (obj == _nullObj ? [NSNull null]: obj));
        }
    };
```

在 `js` 中调用 `console.log` 时:
```
 if (global.console) {
    var jsLogger = console.log;
    global.console.log = function() {
      global._OC_log.apply(global, arguments);
      if (jsLogger) {
        jsLogger.apply(global.console, arguments);
      }
    }
  } else {
    global.console = {
      log: global._OC_log
    }
  }
```



## REF
-   [Git 通过submodule添加子项目/库](http://my.oschina.net/iatbforever/blog/228914)
-   [Git Submodule的坑](http://www.cocoachina.com/industry/20130509/6161.html)
-   [JSPatch Loader 使用文档](https://github.com/bang590/JSPatch/wiki/JSPatch-Loader-%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3)
