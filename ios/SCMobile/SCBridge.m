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
#import "AIRMap.h"
#import "AIRMapManager.h"
#import <MapKit/MapKit.h>

@implementation SCBridge

@synthesize bridge = _bridge;

- (id)init {
  self = [super init];
  scBridge = [[SCRCTBridge alloc] init];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didInitViewManager:) name:RCTDidInitializeModuleNotification object:nil];
  return self;
}

RCT_EXPORT_MODULE();

- (void)didInitViewManager:(NSNotification *)note
{
  id<RCTBridgeModule> module = note.userInfo[@"module"];
  if ([module isKindOfClass:[AIRMapManager class]]) {
    dispatch_async(RCTGetUIManagerQueue(), ^{
      [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        AIRMap *mapView = [self findMapView:viewRegistry];
        if (mapView) {
          id<SCRasterStore> rs =
          (id<SCRasterStore>)[[[SpatialConnect sharedInstance] dataService] storeByIdentifier:@"fad33ae1-f529-4c79-affc-befc37c104ae"];
          [rs overlayFromLayer:@"WhiteHorse" mapview:(AIRMap *)mapView];
        }
      }];
    });
  }
}

- (AIRMap *)findMapView:(NSDictionary<NSNumber *, UIView *> *)viewRegistry
{
  for (NSNumber *reactTag in viewRegistry) {
    id view = viewRegistry[reactTag];
    if ([view isKindOfClass:[AIRMap class]]) {
      return (AIRMap *)view;
    }
  }
  return nil;
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
