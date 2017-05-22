export const numErrMessage = fieldLabel =>
type => `${fieldLabel} must be a ${type}`;

export const minErrMessage = min =>
  fieldLabel => `${fieldLabel} must be at least ${min} characters`;
// error message for maximum length error
export const maxErrMessage = max =>
  fieldLabel => `${fieldLabel} must be at least ${max} characters`;
