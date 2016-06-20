'use strict';
import { stores } from 'spatialconnect/native';

export const loadStores = () => {
  return dispatch => {
    stores().take(1).subscribe(data => {
      dispatch({
        type: 'ADD_STORE_LIST',
        stores: data.stores
      });
    });
  };
};