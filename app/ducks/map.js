import { NavigationActions } from 'react-navigation';
import { findIndex } from 'lodash';
import * as sc from 'react-native-spatialconnect';
import * as mapUtils from '../utils/map';

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
    case sc.Commands.DATASERVICE_STORELIST:
      return {
        ...state,
        activeStores: action.payload.stores
          .filter(s => s.status === sc.StoreStatus.SC_DATASTORE_RUNNING)
          .map(s => s.storeId),
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
      const newFeatures = state.features.concat(action.payload.featureChunk).slice(0, MAX_FEATURES);
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
  .forEach((feature) => {
    switch (feature.geometry.type) {
      case 'Point':
      case 'MultiPoint': {
        const point = mapUtils.makeCoordinates(feature).map(c => ({
          latlng: c,
          feature,
        }));
        points = points.concat(point);
        break;
      }
      case 'Polygon':
      case 'MultiPolygon': {
        const polygon = mapUtils.makeCoordinates(feature).map(c => ({
          coordinates: c,
          feature,
        }));
        polygons = polygons.concat(polygon);
        break;
      }
      case 'LineString':
      case 'MultiLineString': {
        const line = mapUtils.makeCoordinates(feature).map(c => ({
          coordinates: c,
          feature,
        }));
        lines = lines.concat(line);
        break;
      }
      default:
        break;
    }
  });
  return {
    points,
    polygons,
    lines,
  };
};

export const toggleStore = (storeId, active) => ({
  type: 'TOGGLE_STORE',
  payload: {
    storeId,
    active,
  },
});

export const toggleAllStores = active =>
  (dispatch, getState) => {
    const state = getState();
    const stores = state.sc.stores;
    stores.forEach(store => dispatch(toggleStore(store.storeId, active)));
  };

export const queryStores = (bbox = [-180, -90, 180, 90], limit = 50) =>
  (dispatch, getState) => {
    const state = getState();
    const filter = sc.filter().geoBBOXContains(bbox).limit(limit);
    dispatch({
      type: 'CLEAR_FEATURES',
    });
    sc.addRasterLayers(state.map.activeStores);
    sc.spatialQuery$(filter, state.map.activeStores)
      .bufferWithTime(1000)
      .take(5)
      .map(actions => actions.map(a => a.payload))
      .subscribe((featureChunk) => {
        dispatch({
          type: 'ADD_FEATURES',
          payload: { featureChunk },
        });
      });
  };

export const upsertFeature = newFeature =>
  (dispatch, getState) => {
    sc.updateFeature$(newFeature);
    const state = getState();
    const fId = findIndex(state.map.features, f => (
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

export const createFeature = (storeId, layerId, feature) =>
  (dispatch) => {
    const f = sc.geometry(storeId, layerId, feature);
    sc.createFeature$(f).first().subscribe((action) => {
      dispatch(action);
      const newFeature = typeof action.payload === 'string' ?
        JSON.parse(action.payload) : action.payload;
      const navAction = NavigationActions.navigate({
        routeName: 'editFeature',
        params: { feature: newFeature },
      });
      dispatch(navAction);
    });
  };

export const addCreatingPoint = point => ({
  type: 'ADD_CREATING_POINT',
  payload: { point },
});

export const setCreatingType = type => ({
  type: 'SET_CREATING_TYPE',
  payload: { type },
});

export const cancelCreating = () => ({
  type: 'CANCEL_CREATING',
});
