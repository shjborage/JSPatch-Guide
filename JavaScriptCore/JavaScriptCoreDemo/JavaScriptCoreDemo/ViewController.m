//
//  ViewController.m
//  JavaScriptCoreDemo
//
//  Created by shihaijie on 3/29/16.
//  Copyright © 2016 Saick. All rights reserved.
//

#import "ViewController.h"
@import JavaScriptCore;

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    // Objective-C调用JavaScript
    JSContext *context = [[JSContext alloc] init];
    JSValue *jsVal = [context evaluateScript:@"21+7"];
    int iVal = [jsVal toInt32];
    NSLog(@"JSValue: %@, int: %d", jsVal, iVal);
    
    // JavaScript调用Objective-C
//    JSContext *context = [[JSContext alloc] init];
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
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
