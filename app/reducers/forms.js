'use strict';

const forms = (state = [], action) => {
  switch (action.type) {
    case 'ADD_FORM':
      return [
        ...state,
        action.form
      ];
    case 'ADD_FORM_LIST':
      return action.forms;
    default:
      return state;
  }
};

export default forms;