'use strict';
import * as sc from 'spatialconnect/native';

const initialState = {
  forms: [],
  stores: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case sc.Commands.DATASERVICE_FORMLIST:
      return {
        ...state,
        forms: action.payload.forms
      };
    case sc.Commands.DATASERVICE_ACTIVESTORESLIST:
      return {
        ...state,
        stores: action.payload.stores
      };
    default:
      return state;
  }
};

export default reducer;