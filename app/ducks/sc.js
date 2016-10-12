'use strict';
import * as sc from 'spatialconnect/native';
import { Actions } from 'react-native-router-flux';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

const initialState = {
  forms: [],
  stores: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case sc.Commands.DATASERVICE_FORMLIST:
      return {
        ...state,
        forms: action.payload.forms
      };
    case sc.Commands.DATASERVICE_ACTIVESTORESLIST:
      return {
        ...state,
        stores: action.payload.stores,
        activeStores: action.payload.stores.map(s => s.storeId)
      };
    default:
      return state;
  }
};

export const connectSC = store => {
  sc.startAllServices();
  sc.loginStatus$().subscribe(action => {
    store.dispatch(action);
    if (action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED) {
      sc.forms$().subscribe(store.dispatch);
      sc.stores$().subscribe(store.dispatch);
      sc.xAccessToken$().subscribe(store.dispatch);
      Actions.formNav();
    } else {
      Actions.login();
    }
  });
  sc.notifications$().take(1).subscribe(action => {
    const n = action.payload.notification;
    if (action.payload.priority === 'alert') {
      Alert.alert(n.title, n.body);
    }
  });

  if (Platform.OS === 'android' && Platform.Version >= 23 ) {
    try {
      const granted = PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          'title': 'GPS permission',
          'message': 'EFC needs access to your GPS '
        }
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