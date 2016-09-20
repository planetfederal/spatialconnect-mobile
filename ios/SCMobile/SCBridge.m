//
//  SCBridge.h
//  SCMobile
//
//  Created by Frank Rowe on 6/6/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "SCBridge.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import <ReactiveCocoa/RACSignal.h>
#import <SpatialConnect/SCRCTBridge.h>
#import <SpatialConnect/SCJavascriptCommands.h>

@implementation SCBridge

@synthesize bridge = _bridge;

- (id)init {
  self = [super init];
  scBridge = [[SCRCTBridge alloc] init];
  return self;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(handler:(NSDictionary *)action)
{
  NSLog(@"action %@", action);
  [scBridge handler:action responseCallback:^(NSDictionary *newAction, NSInteger status) {
    NSString *type = action[@"responseId"] != nil ? action[@"responseId"] : [action[@"type"] stringValue];
    if (status == SCJSSTATUS_COMPLETED) {
      type = [type stringByAppendingString:@"_completed"];
    }
    if (status == SCJSSTATUS_ERROR) {
      type = [type stringByAppendingString:@"_error"];
    }
    //NSLog(@"newAction %@", newAction);
    //NSLog(@"type %@", type);
    [self.bridge.eventDispatcher sendAppEventWithName:type body:newAction];
  }];
}


@end
