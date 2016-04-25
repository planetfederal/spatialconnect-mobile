//
//  SCReactBridge.m
//  SCMobile
//
//  Created by Frank Rowe on 4/25/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(SCBridge, NSObject)

RCT_EXTERN_METHOD(handler:(NSDictionary *)data)

@end