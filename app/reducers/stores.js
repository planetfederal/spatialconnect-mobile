'use strict';

const stores = (state = [], action) => {
  switch (action.type) {
    case 'ADD_STORE':
      return [
        ...state,
        action.store
      ];
    case 'ADD_STORE_LIST':
      return action.stores;
    default:
      return state;
  }
};

export default stores;