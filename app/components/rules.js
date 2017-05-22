// original code from https://github.com/ok2ju/react-form-validation
// article about code https://spin.atomicobject.com/2016/10/05/form-validation-react/
import * as Rules from './errorMessages';

let fieldLabel;
// if there is an types  match return null if not return error message

export const mustBeANum = (type, fieldValue) =>
  isNaN(fieldValue) ? Rules.numErrMessage(fieldLabel, type) : null;

export const strMin = (min, fieldValue) =>
  fieldValue.length < min ? Rules.minErrMessage(min, fieldValue) : null;


export const strMax = (max, fieldValue) =>
  fieldValue.length > max ? Rules.maxErrMessage(max, fieldValue) : null;

/*
// if length of input is over the minimum return null, else return error message
export const minLength = (min) => {
  return (field_key) => {
    console.log("Checking for length greater than ", min);
    return field_key >= min ? null : ErrorMessages.minLength(min);
  };
};

// if length of input is less than the maximum return null, else return error message
export const maxLength = (max) => {
  return (field_key) => {
    console.log("Checking for length greater than ");
    return field_key <= max ? null : ErrorMessages.maxLength(max);
  };
};
*/
