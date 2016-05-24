//
//  SCBridge.swift
//  SCMobile
//
//  Created by Frank Rowe on 4/25/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation
@objc(SCBridge)
class SCBridge: NSObject {
  
  var sc: SpatialConnect!
  var bridge: RCTBridge!
  
  let SCJavascriptBridgeErrorDomain = "SCJavascriptBridgeErrorDomain"
  
  override init() {
    let del = UIApplication.sharedApplication().delegate as! AppDelegate
    self.sc = del.spatialConnectSharedInstance()
    super.init()
    self.setup()
  }
  
  func setup() {
    self.sc.sensorService.enableGPS()
    self.sc.sensorService.lastKnown.subscribeNext {(next:AnyObject!) -> () in
      if let loc = next as? CLLocation {
        let lat:Double = loc.coordinate.latitude
        let lon:Double = loc.coordinate.longitude
        self.sendEvent("lastKnownLocation", data: [ "lat": lat, "lon": lon ])
      }
    }
  }
  
  @objc func handler(command:NSDictionary) -> Void {
    self.parseJSCommand(command).subscribeNext {(next:AnyObject!) -> () in
      
    }
  }
  
  func sendEvent(key: String, data: NSDictionary, completed: (() -> Void)? = nil) -> Void {
    if (self.bridge.eventDispatcher != nil) {
      self.bridge.eventDispatcher.sendAppEventWithName(key, body: data)
    }
    completed?()
  }
  
  func parseJSCommand(data: NSDictionary) -> RACSignal {
    NSLog("JS Command: %@", data);
    return RACSignal.createSignal { (subscriber) -> RACDisposable! in
      var num: Int
      let command = data["data"] as! NSDictionary
      let _action = command["action"] as! Int
      let action = SCJavascriptCommand(rawValue: _action)!
      switch action {
      case .DATASERVICE_ACTIVESTORESLIST:
        self.activeStoreList(subscriber)
      case .DATASERVICE_ACTIVESTOREBYID:
        self.activeStoreById(command["payload"] as! NSDictionary, responseSubscriber: subscriber)
      case .DATASERVICE_SPATIALQUERY:
        self.queryStoreById(command["payload"] as! NSDictionary, responseSubcriber: subscriber)
      case .DATASERVICE_SPATIALQUERYALL:
        self.queryAllStores(command["payload"] as! NSDictionary, responseSubscriber: subscriber)
      case .DATASERVICE_GEOSPATIALQUERY:
        self.queryGeoStoreById(command["payload"] as! NSDictionary, responseSubscriber: subscriber)
      case .DATASERVICE_GEOSPATIALQUERYALL:
        self.queryAllGeoStores(command["payload"] as! NSDictionary, responseSubscriber: subscriber)
      case .DATASERVICE_CREATEFEATURE:
        self.createFeature(command["payload"] as! NSDictionary, responseSubscriber: subscriber)
      case .DATASERVICE_UPDATEFEATURE:
        self.updateFeature(command["payload"] as! NSDictionary, responseSubscriber: subscriber)
      case .DATASERVICE_DELETEFEATURE:
        self.deleteFeature(command["payload"] as! String, responseSubscriber: subscriber)
      case .DATASERVICE_FORMLIST:
        self.formList(subscriber)
      case .SENSORSERVICE_GPS:
        num = command["payload"] as! Int
        self.spatialConnectGPS(num)
        subscriber.sendCompleted()
      default:
        break
      }
      return nil
    }
  }
  
  func activeStoreList(subscriber: RACSubscriber) {
    let arr: [AnyObject] = self.sc.dataService.activeStoreListDictionary()
    subscriber.sendCompleted()
    self.sendEvent("storesList", data: ["stores": arr])
  }
  
  func formList(subscriber: RACSubscriber) {
    let arr: [AnyObject] = self.sc.dataService.defaultStoreForms().map {
      (formConfig) -> NSDictionary in return formConfig.JSONDict()
    }
    subscriber.sendCompleted()
    self.sendEvent("formsList", data: ["forms": arr])
  }
  
  func activeStoreById(value: NSDictionary, responseSubscriber subscriber: RACSubscriber) {
    let dict = self.sc.dataService.storeByIdAsDictionary(value["storeId"] as! String)
    subscriber.sendCompleted()
    self.sendEvent("store", data: ["store": dict])
  }
  
  func queryAllStores(value: NSDictionary, responseSubscriber subscriber: RACSubscriber) {
    let filter: SCQueryFilter = SCQueryFilter(fromDictionary: value["filters"] as! [NSObject : AnyObject])
    self.sc.dataService.queryAllStores(filter).subscribeNext {(next:AnyObject!) -> () in
      let g = next as! SCGeometry
      self.sendEvent("spatialQuery", data: g.JSONDict())
      subscriber.sendCompleted()
    }
  }
  
  func queryStoreById(value: NSDictionary, responseSubcriber subscriber: RACSubscriber) {
    self.sc.dataService.queryStoreById(String(value["storeId"]), withFilter: nil).subscribeNext {(next:AnyObject!) -> () in
      let g = next as! SCGeometry
      let gj = g.JSONDict()
      subscriber.sendCompleted()
      self.sendEvent("spatialQuery", data: gj)
    }
  }
  
  func queryAllGeoStores(value: NSDictionary, responseSubscriber subscriber: RACSubscriber) {
    let filter: SCQueryFilter = SCQueryFilter(fromDictionary: value as [NSObject : AnyObject])
    self.sc.dataService.queryAllStoresOfProtocol(SCSpatialStore.self, filter: filter).subscribeNext {(next:AnyObject!) -> () in
      let g = next as! SCGeometry
      let gj = g.JSONDict()
      subscriber.sendCompleted()
      self.sendEvent("spatialQuery", data: gj)
    }
  }
  
  func queryGeoStoreById(value: NSDictionary, responseSubscriber subscriber: RACSubscriber) {
    let filter: SCQueryFilter = SCQueryFilter(fromDictionary: value as [NSObject : AnyObject])
    self.sc.dataService.queryStoreById(String(value["storeId"]), withFilter: filter).subscribeNext {(next:AnyObject!) -> () in
      let g = next as! SCGeometry
      let gj = g.JSONDict()
      self.sendEvent("spatialQuery", data: gj, completed: {() -> Void in
        subscriber.sendCompleted()
      })
    }
  }
  
  func spatialConnectGPS(value: AnyObject) {
    let enable = value as! Bool
    if enable {
      self.sc.sensorService.enableGPS()
    }
    else {
      self.sc.sensorService.disableGPS()
    }
  }
  
  func createFeature(value: NSDictionary, responseSubscriber subscriber: RACSubscriber) {
    let geoJsonDict = (value["feature"] as! [NSObject : AnyObject])
    let storeId: String = (geoJsonDict["storeId"] as! String)
    let layerId: String = (geoJsonDict["layerId"] as! String)
    var store: SCDataStore? = self.sc.dataService.storeByIdentifier(storeId)
    if (store == nil) {
      store = self.sc.dataService.defaultStore
    }
    if store!.conformsToProtocol(SCSpatialStore.self) {
      let s: GeopackageStore = (store as! GeopackageStore)
      do {
        let feat: SCSpatialFeature = SCGeoJSON.parseDict(geoJsonDict)
        feat.layerId = layerId
        s.create(feat).subscribeError({(error:NSError!) -> Void in
          NSLog("Error creating Feature %@", error);
          }, completed: {() -> Void in
            //let g: SCGeometry = (feat as! SCGeometry)
            self.sendEvent("createFeature", data: feat.JSONDict())
        })
      } catch {
        let err: NSError = NSError(domain: SCJavascriptBridgeErrorDomain, code: -57, userInfo: nil)
        subscriber.sendError(err)
      }
    }
    else {
      let err: NSError = NSError(domain: SCJavascriptBridgeErrorDomain, code: -57, userInfo: nil)
      subscriber.sendError(err)
    }
  }
  
  func updateFeature(value: NSDictionary, responseSubscriber subscriber: RACSubscriber) {
    let jsonStr = String(value["feature"])
    do {
      let geoJsonDict: [NSObject : AnyObject] = try SCFileUtils.jsonStringToDict(jsonStr)
      let geom: SCGeometry = SCGeoJSON.parseDict(geoJsonDict)
      let t: SCKeyTuple = SCKeyTuple(fromEncodedCompositeKey: geom.identifier)
      geom.storeId = t.storeId
      geom.layerId = t.layerId
      geom.identifier = t.featureId
      let store: SCDataStore = self.sc.dataService.storeByIdentifier(geom.storeId)
      if store.conformsToProtocol(SCSpatialStore.self) {
        let s: SCSpatialStore = (store as! SCSpatialStore)
        s.update(geom).subscribeError({(error:NSError!) -> Void in
          let err: NSError = NSError(domain: self.SCJavascriptBridgeErrorDomain, code: SCJavascriptError.SCJSERROR_DATASERVICE_UPDATEFEATURE.rawValue, userInfo: nil)
          subscriber.sendError(err)
          }, completed: {() -> Void in
            subscriber.sendCompleted()
        })
      } else {
        let err: NSError = NSError(domain: self.SCJavascriptBridgeErrorDomain, code: SCJavascriptError.SCJSERROR_DATASERVICE_UPDATEFEATURE.rawValue, userInfo: nil)
        subscriber.sendError(err)
      }
    } catch {
      let err: NSError = NSError(domain: self.SCJavascriptBridgeErrorDomain, code: SCJavascriptError.SCJSERROR_DATASERVICE_UPDATEFEATURE.rawValue, userInfo: nil)
      subscriber.sendError(err)
    }
  }
  
  func deleteFeature(value: String, responseSubscriber subscriber: RACSubscriber) {
    let key: SCKeyTuple = SCKeyTuple(fromEncodedCompositeKey: value)
    let store: SCDataStore = self.sc.dataService.storeByIdentifier(key.storeId)
    if store.conformsToProtocol(SCSpatialStore.self) {
      let s: SCSpatialStore = (store as! SCSpatialStore)
      s.delete(key).subscribeError({(error:NSError!) -> Void in
        let err: NSError = NSError(domain: self.SCJavascriptBridgeErrorDomain, code: SCJavascriptError.SCJSERROR_DATASERVICE_DELETEFEATURE.rawValue, userInfo: nil)
        subscriber.sendError(err)
        }, completed: {() -> Void in
          subscriber.sendCompleted()
      })
    }
    else {
      let err: NSError = NSError(domain: self.SCJavascriptBridgeErrorDomain, code: SCJavascriptError.SCJSERROR_DATASERVICE_DELETEFEATURE.rawValue, userInfo: nil)
      subscriber.sendError(err)
    }
  }
  
  
}