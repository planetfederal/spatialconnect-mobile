// original code from https://github.com/ok2ju/react-form-validation
// article about code https://spin.atomicobject.com/2016/10/05/form-validation-react/
import * as ErrorMessages from './errorMessages';

// let max;
// if there is an types  match return null if not return error message
// export const mustBeANum = (type, fieldValue) =>
//   isNaN(fieldValue) ? ErrorMessages.numErrMessage({ fieldLabel }, type) : null;
export const mustBeANum = (text, field) => {
    console.log('must be a num func');
    text = +[text];
    console.log(text);
  if (isNaN(text)) {
    console.log('ERROR TRIGGERED');
    return ErrorMessages.numErrMessage(text, field);
  } else {
    return null;
  }
};

// export const strMin = (min, field) =>
// // this should return a function
//   field.field_key.length < min ? ErrorMessages.minErrMessage(min) : null;
//
//
// export const strMax = (max) =>
//   fieldValue.length > max ? ErrorMessages.maxErrMessage(max) : null;
