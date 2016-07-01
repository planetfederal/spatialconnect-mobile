'use strict';
import * as sc from 'spatialconnect/native';

export const loadForms = () => {
  return dispatch => {
    sc.forms().subscribe(data => {
      dispatch({
        type: 'ADD_FORM_LIST',
        forms: data.forms
      });
    });
  };
};