//
//  DataViewController.m
//  DevelopDemo
//
//  Created by shihaijie on 3/30/16.
//  Copyright © 2016 Saick. All rights reserved.
//

#import "DataViewController.h"

@interface DataViewController ()

@end

@implementation DataViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    [self.view addSubview:[self genView]];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    self.dataLabel.text = [self.dataObject description];
}

- (UIView *)genView
{
    return [[UIView alloc] initWithFrame:CGRectMake(0, 0, 320, 320)];
}

#pragma mark - test block

+ (void)testBlock:(void(^)(NSString *content, BOOL success))callback {
    callback(@"I'm the test content", YES);
}

typedef void (^JSBlock)(NSDictionary *dict);
+ (JSBlock)genBlock
{
    NSString *ctn = @"JSPatch";
    JSBlock block = ^(NSDictionary *dict) {
        NSLog(@"I'm %@, version: %@", ctn, dict[@"v"]);
    };
    return block;
}


@end
