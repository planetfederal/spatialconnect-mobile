/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "RCTRootView.h"
#import "RCTBundleURLProvider.h"
#import <Crashlytics/Crashlytics.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [Crashlytics startWithAPIKey:@"93c312957d2dbf3351bffe24bea587c15ab7a893"];

  NSURL *jsCodeLocation;

 //Loading JavaScript code
#if DEBUG
  jsCodeLocation =
    [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
  jsCodeLocation =
      [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
  //jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SCMobile"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor =
      [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [self startSpatialConnect];

  return YES;
}

- (void)startSpatialConnect {
  if (!sc) {
    NSString *cfgPath = [SCFileUtils filePathFromMainBundle:@"remote.scfg"];
    sc = [SpatialConnect sharedInstance];
    [sc.configService addConfigFilepath:cfgPath];
    [sc startAllServices];
    [sc.sensorService enableGPS];
  }
}

- (SpatialConnect *)spatialConnectSharedInstance {
  return sc;
}

@end
