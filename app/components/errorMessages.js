export const numErrMessage = fieldLabel =>
(type) => {
  `${fieldLabel} must be a ${type}`;
};
//

/*
// error message for minimum length error

export const minLength = min => {
  return (field_label) => `${field_label} must be at least ${min} characters`;
};
// error message for maximum length error
export const maxLength = max => {
  return (field_label) => `${field_label} must be at least ${max} characters`;
};

*/
