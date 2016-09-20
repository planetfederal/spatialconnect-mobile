'use strict';
import * as sc from 'spatialconnect/native';
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';

const initialState = {
  forms: [],
  stores: [],
  activeStores: [],
  features: [],
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
    case 'TOGGLE_STORE':
      return {
        ...state,
        activeStores: action.payload.active ?
          state.activeStores.concat(action.payload.storeId) :
          state.activeStores.filter(sId => sId !== action.payload.storeId)
      };
    case 'CLEAR_FEATURES':
      return {
        ...state,
        features: []
      };
    case 'ADD_FEATURES':
      return {
        ...state,
        features: state.features.concat(action.payload)
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
    Alert.alert('Geofencing Alert','You have entered a designated zone');
  });
};

export const toggleStore = (storeId, active) => {
  return {
    type: 'TOGGLE_STORE',
    payload: {
      storeId: storeId,
      active: active
    }
  };
};

export const toggleAllStores = (active) => {
  return (dispatch, getState) => {
    const state = getState();
    let stores = state.sc.stores;
    stores.forEach(store => {
      dispatch(toggleStore(store.storeId, active));
    });
  };
};

export const queryStores = (bbox=[-180, -90, 180, 90], limit=50) => {
  return (dispatch, getState) => {
    const state = getState();
    var filter = sc.filter.geoBBOXContains(bbox).limit(limit);
    dispatch({
      type: 'CLEAR_FEATURES'
    });
    sc.geospatialQuery$(filter, state.sc.activeStores)
      .map(action => action.payload)
      .bufferWithTime(200)
      .subscribe(fs => {
        dispatch({
          type: 'ADD_FEATURES',
          payload: fs
        });
      });
  };
};
