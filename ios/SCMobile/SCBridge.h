//
//  SCBridge.h
//  SCMobile
//
//  Created by Frank Rowe on 6/6/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import <SpatialConnect/SCRCTBridge.h>

@interface SCBridge : NSObject <RCTBridgeModule> {
  SCRCTBridge *scBridge;
}

@end
