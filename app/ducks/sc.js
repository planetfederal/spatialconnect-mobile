import * as sc from 'react-native-spatialconnect';
import Rx from 'rx';
import { Platform, PermissionsAndroid } from 'react-native';

const initialState = {
  forms: [],
  stores: [],
  backendUri: null,
  connectionStatus: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case sc.Commands.DATASERVICE_FORMLIST:
      return {
        ...state,
        forms: action.payload.forms,
      };
    case sc.Commands.DATASERVICE_STORELIST:
      return {
        ...state,
        stores: action.payload.stores,
      };
    case sc.Commands.BACKENDSERVICE_HTTP_URI:
      return {
        ...state,
        backendUri: action.payload.backendUri,
      };
    case sc.Commands.BACKENDSERVICE_MQTT_CONNECTED:
      return {
        ...state,
        connectionStatus: action.payload.connected,
      };
    default:
      return state;
  }
};

export const connectSC = (store) => {
  sc.addConfigFilepath('remote.scfg');
  sc.startAllServices();
  sc.backendUri$().subscribe(store.dispatch);
  sc.loginStatus$().subscribe((action) => {
    store.dispatch(action);
    if (action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED) {
      Rx.Observable.merge(
        sc.forms$(),
        sc.stores$(),
        sc.mqttConnected$(),
        sc.xAccessToken$(),
      ).subscribe(store.dispatch);
    }
  });

  if (Platform.OS === 'android' && Platform.Version >= 23) {
    try {
      const granted = PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'GPS permission',
          message: 'EFC needs access to your GPS',
        },
      );
      if (granted) {
        sc.enableGPS();
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    sc.enableGPS();
  }
};
