// original code from https://github.com/ok2ju/react-form-validation
// article about code https://spin.atomicobject.com/2016/10/05/form-validation-react/
import * as ErrorMessages from './errorMessages';

let fieldLabel;
let max;
// if there is an types  match return null if not return error message
// export const mustBeANum = (type, fieldValue) =>
//   isNaN(fieldValue) ? ErrorMessages.numErrMessage({ fieldLabel }, type) : null;
export const mustBeANum = (type, fieldValue) => {
  console.log(this.state);
  return (fieldValue, state) => {
    isNaN(fieldValue) ? ErrorMessages.numErrMessage({ fieldLabel }, type) : null;
  };
};

export const strMin = (min, fieldValue) =>
  fieldValue.length < min ? ErrorMessages.minErrMessage(min, fieldValue) : null;


export const strMax = (max, fieldValue) =>
  fieldValue.length > max ? ErrorMessages.maxErrMessage(max, fieldValue) : null;
