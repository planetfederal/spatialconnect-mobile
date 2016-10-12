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
#import "RCTUIManager.h"
#import <ReactiveCocoa/RACSignal.h>
#import <SpatialConnect/SCRCTBridge.h>
#import <SpatialConnect/SCRasterStore.h>
#import <SpatialConnect/SCJavascriptCommands.h>
#import <SpatialConnect/SCSpatialStore.h>
#import "AIRMap.h"
#import "AIRMapManager.h"
#import <MapKit/MapKit.h>

@implementation SCBridge

@synthesize bridge = _bridge;

- (id)init {
  self = [super init];
  scBridge = [[SCRCTBridge alloc] init];
  return self;
}

RCT_EXPORT_MODULE();


RCT_EXPORT_METHOD(bindMapView:(nonnull NSNumber *)reactTag)
{
  dispatch_async(RCTGetUIManagerQueue(), ^{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
      id view = viewRegistry[reactTag];
      if (![view isKindOfClass:[AIRMap class]]) {
        RCTLogError(@"Invalid view returned from registry, expecting AIRMap, got: %@", view);
      } else {
        AIRMap *mapView = (AIRMap *)view;
        NSArray *stores = [[[SpatialConnect sharedInstance] dataService] storesByProtocol:@protocol(SCRasterStore)];
        [[[[[[stores rac_sequence] signal] filter:^BOOL(SCDataStore *store) {
          return [((id<SCRasterStore>)store).rasterLayers count] > 0;
        }] map:^RACTuple*(SCDataStore *store) {
          return [RACTuple tupleWithObjects:store.storeId, ((id<SCRasterStore>)store).rasterLayers, nil];
        }] deliverOn:[RACScheduler mainThreadScheduler]] subscribeNext:^(RACTuple *t) {
          id<SCRasterStore> rs =
          (id<SCRasterStore>)[[[SpatialConnect sharedInstance] dataService] storeByIdentifier:[t first]];
          for (id layer in [t second]) {
            [rs overlayFromLayer:layer mapview:(AIRMap *)mapView];
          }
        }];
      }
    }];
  });
}

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
