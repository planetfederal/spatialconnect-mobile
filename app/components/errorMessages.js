// errorMessages.js
// original code from https://github.com/ok2ju/react-form-validation
//article about code https://spin.atomicobject.com/2016/10/05/form-validation-react/
// error message for mismatched types

export const mustBeANum = field_label => {
  return (field_label) => `${field_label} must be a ${type}`;
  console.log('must be a number');
};
/*
// error message for minimum length error

export const minLength = min => {
  return (field_label) => `${field_label} must be at least ${min} characters`;
};
// error message for maximum length error
export const maxLength = max => {
  return (field_label) => `${field_label} must be at least ${max} characters`;
};

export const
*/
