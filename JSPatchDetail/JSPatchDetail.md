## 准备工作
先通过 `git submodule` 把代码拉下来。。。

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
