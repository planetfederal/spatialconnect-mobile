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

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
    // Loading JavaScript code
  #if DEBUG
    #if TARGET_IPHONE_SIMULATOR
      jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
    #else
      jsCodeLocation = [NSURL URLWithString:@"http://192.168.0.6:8081/index.ios.bundle?platform=ios&dev=true"];
    #endif
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SCMobile"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

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
    NSURL *URL = [NSURL URLWithString:@"https://portal.opengeospatial.org"];
    
    [NSURLRequest
     .class performSelector:NSSelectorFromString(
                                                 @"setAllowsAnyHTTPSCertificate:forHost:")
     withObject:NSNull.null // Just need to pass non-nil here
     // to appear as a BOOL YES, using
     // the NSNull.null singleton is
     // pretty safe
     withObject:[URL host]];
    NSURL *URL2 = [NSURL URLWithString:@"https://s3-us-west-2.amazonaws.com"];
    
    [NSURLRequest
     .class performSelector:NSSelectorFromString(
                                                 @"setAllowsAnyHTTPSCertificate:forHost:")
     withObject:NSNull.null // Just need to pass non-nil here
     // to appear as a BOOL YES, using
     // the NSNull.null singleton is
     // pretty safe
     withObject:[URL2 host]];
    NSURL *URL3 = [NSURL URLWithString:@"https://s3.amazonaws.com"];
    
    [NSURLRequest
     .class performSelector:NSSelectorFromString(
                                                 @"setAllowsAnyHTTPSCertificate:forHost:")
     withObject:NSNull.null // Just need to pass non-nil here
     // to appear as a BOOL YES, using
     // the NSNull.null singleton is
     // pretty safe
     withObject:[URL3 host]];
    
    SCStyle *style = [[SCStyle alloc] init];
    style.fillColor = [UIColor orangeColor];
    style.fillOpacity = 0.25f;
    style.strokeColor = [UIColor yellowColor];
    style.strokeOpacity = 0.5f;
    style.strokeWidth = 2;
    
    [sc startAllServices];
    
    
  }
}

- (SpatialConnect *)spatialConnectSharedInstance {
  return sc;
}

@end
