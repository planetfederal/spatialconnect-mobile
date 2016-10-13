'use strict';
import { Actions } from 'react-native-router-flux';
import * as sc from 'spatialconnect/native';
import * as mapUtils from '../utils/map';
import { findIndex } from 'lodash';

const MAX_FEATURES = 100;

const initialState = {
  activeStores: [],
  features: [],
  overlays: {
    points: [],
    polygons: [],
    lines: [],
  },
  creatingPoints: [],
  creatingType: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case sc.Commands.DATASERVICE_ACTIVESTORESLIST:
      return {
        ...state,
        activeStores: action.payload.stores.map(s => s.storeId),
      };
    case 'TOGGLE_STORE':
      return {
        ...state,
        activeStores: action.payload.active ?
          state.activeStores.concat(action.payload.storeId) :
          state.activeStores.filter(sId => sId !== action.payload.storeId),
      };
    case 'CLEAR_FEATURES':
      return {
        ...state,
        features: [],
        overlays: {
          points: [],
          polygons: [],
          lines: [],
        },
        updatedFeature: false,
      };
    case 'ADD_FEATURES': {
      if (state.features.length >= MAX_FEATURES) {
        return state;
      }
      let newFeatures = state.features.concat(action.payload.featureChunk).slice(0, MAX_FEATURES);
      return {
        ...state,
        features: newFeatures,
        overlays: makeOverlays(state.overlays, newFeatures),
      };
    }
    case 'UPDATE_FEATURE': {
      const nfs = [
        ...state.features.slice(0, action.payload.fId),
        action.payload.newFeature,
        ...state.features.slice(action.payload.fId + 1),
      ];
      return {
        ...state,
        features: nfs,
        overlays: makeOverlays(state.overlays, nfs),
      };
    }
    case 'ADD_FEATURE': {
      const nfs = state.features.concat(action.payload.newFeature);
      return {
        ...state,
        features: nfs,
        overlays: makeOverlays(state.overlays, nfs),
      };
    }
    case 'ADD_CREATING_POINT':
      return {
        ...state,
        creatingPoints: state.creatingPoints.concat(action.payload.point),
      };
    case 'SET_CREATING_TYPE':
      return {
        ...state,
        creatingType: action.payload.type,
        creatingPoints: [],
      };
    case 'CANCEL_CREATING':
      return {
        ...state,
        creatingType: null,
        creatingPoints: [],
      };
    default:
      return state;
  }
}

const makeOverlays = (overlays, features) => {
  let points = [];
  let polygons = [];
  let lines = [];
  features
  .filter(f => f.geometry)
  .forEach(feature => {
    switch (feature.geometry.type) {
      case 'Point':
      case 'MultiPoint': {
        let point = mapUtils.makeCoordinates(feature).map(c => ({
          latlng: c,
          feature: feature,
        }));
        points = points.concat(point);
        break;
      }
      case 'Polygon':
      case 'MultiPolygon': {
        let polygon = mapUtils.makeCoordinates(feature).map(c => ({
          coordinates: c,
          feature: feature,
        }));
        polygons = polygons.concat(polygon);
        break;
      }
      case 'LineString':
      case 'MultiLineString': {
        let line = mapUtils.makeCoordinates(feature).map(c => ({
          coordinates: c,
          feature: feature,
        }));
        lines = lines.concat(line);
      }
    }
  });
  return {
    points: points,
    polygons: polygons,
    lines: lines,
  };
};

export const toggleStore = (storeId, active) => {
  return {
    type: 'TOGGLE_STORE',
    payload: {
      storeId: storeId,
      active: active,
    },
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
      type: 'CLEAR_FEATURES',
    });
    sc.geospatialQuery$(filter, state.map.activeStores)
      .take(MAX_FEATURES)
      .map(action => action.payload)
      .bufferWithTime(1000)
      .subscribe(featureChunk => {
        dispatch({
          type: 'ADD_FEATURES',
          payload: { featureChunk },
        });
      });
  };
};

export const upsertFeature = (newFeature) => {
  return (dispatch, getState) => {
    sc.updateFeature(newFeature);
    const state = getState();
    let fId = findIndex(state.map.features, f => (
      f.id === newFeature.id &&
      f.metadata.storeId === newFeature.metadata.storeId &&
      f.metadata.layerId === newFeature.metadata.layerId
    ));
    if (fId >= 0) {
      dispatch({
        type: 'UPDATE_FEATURE',
        payload: { newFeature, fId },
      });
    } else {
      dispatch({
        type: 'ADD_FEATURE',
        payload: { newFeature },
      });
    }
  };
};

export const createFeature = (storeId, layerId, feature) => {
  return dispatch => {
    let f = sc.geometry(storeId, layerId, feature);
    sc.createFeature$(f.serialize()).first().subscribe(action => {
      dispatch(action);
      Actions.editFeature({feature: action.payload});
    });
  };
};

export const addCreatingPoint = point => {
  return {
    type: 'ADD_CREATING_POINT',
    payload: { point },
  };
};

export const setCreatingType = type => {
  return {
    type: 'SET_CREATING_TYPE',
    payload: { type },
  };
};

export const cancelCreating = () => {
  return {
    type: 'CANCEL_CREATING',
  };
};
