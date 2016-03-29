## 学习笔记
### `JavaScriptCore.framework` 使用环境
首先确认使用环境是 iOS7 以上版本，之前的版本需要使用 `UIWebView` 来实现类似功能。不过目前的版本情况，iOS7 以上不是做梦，大多数大厂的应用都可以这么来搞了。。

关于一些基础信息的使用以及注意事项：

>A JSVirtualMachine instance represents a self-contained environment for JavaScript execution. You use this class for two main purposes: to support concurrent JavaScript execution, and to manage memory for objects bridged between JavaScript and Objective-C or Swift.
>
>####Threading and Concurrent JavaScript Execution
>Each JavaScript context (a JSContext object) belongs to a virtual machine. Each virtual machine can encompass multiple contexts, allowing values (JSValue objects) to be passed between contexts. However, each virtual machine is distinct—you cannot pass a value created in one virtual machine to a context in another virtual machine.
>
>The JavaScriptCore API is thread safe—for example, you can create JSValue objects or evaluate scripts from any thread—however, all other threads attempting to use the same virtual machine will wait. To run JavaScript concurrently on multiple threads, use a separate JSVirtualMachine instance for each thread.
>
>####Managing Memory for Exported Objects
>When you export an Objective-C or Swift object to JavaScript, you must not to store JavaScript values in that object. This action creates a retain cycle—JSValue objects hold strong references to their enclosing JavaScript contexts, and JSContext objects hold strong references to the native objects you export to JavaScript. Instead, use use the JSManagedValue class to conditionally retain a JavaScript value, and report the native ownership chain for that managed value to the JavaScriptCore virtual machine. Use the addManagedReference:withOwner: and removeManagedReference:withOwner: methods to describe your native object graph to JavaScriptCore. After you remove the last managed reference for an object, that object can be safely destroyed by the JavaScript garbage collector.

### Objective-C中执行JavaScript
`JavaScript` 可以通过 `JSContext` 中进行执行，并且是线程安全的。每个 `JSContext` 都属于一个 `JSVirtualMachine`, 默认情况下 `JSVirtualMachine` 会在创建 `JSContext` 时自动创建。
其中 `JSValue` 中通信的桥梁，可以在OC与JS参数间互相转换：
```
  Objective-C type   |   JavaScript type
 --------------------+---------------------
         nil         |     undefined
        NSNull       |        null
       NSString      |       string
       NSNumber      |   number, boolean
     NSDictionary    |   Object object
       NSArray       |    Array object
        NSDate       |     Date object
       NSBlock (1)   |   Function object (1)
          id (2)     |   Wrapper object (2)
        Class (3)    | Constructor object (3)
```

一个简单的例子：
```
JSContext *context = [[JSContext alloc] init];
JSValue *jsVal = [context evaluateScript:@"21+7"];
int iVal = [jsVal toInt32];
NSLog(@"JSValue: %@, int: %d", jsVal, iVal);
 
//Output:
//  JSValue: 28, int: 28
```

### JavaScript调用Objective-C

```
JSContext *context = [[JSContext alloc] init];
context[@"log"] = ^() {
    NSLog(@"+++++++Begin Log+++++++");
 
    NSArray *args = [JSContext currentArguments];
    for (JSValue *jsVal in args) {
        NSLog(@"%@", jsVal);
    }
 
    JSValue *this = [JSContext currentThis];
    NSLog(@"this: %@",this);
    NSLog(@"-------End Log-------");
};
 
[context evaluateScript:@"log('ider', [7, 21], { hello:'world', js:100 });"];
 
//Output:
//  +++++++Begin Log+++++++
//  ider
//  7,21
//  [object Object]
//  this: [object GlobalObject]
//  -------End Log-------
```

通过对 `JSContect` 的这种用法，相当于是对定义了一个用OC实现的js方法，给js代码来调用，这样就实现了js调用oc。
**这种方法可以实现很多js里不能实现或不好实现的功能，由oc来提供实现。**


## REF
-   <http://blog.iderzheng.com/introduction-to-ios7-javascriptcore-framework/>
-   <http://blog.iderzheng.com/ios7-objects-management-in-javascriptcore-framework/>