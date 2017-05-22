import * as Rules from './errorMessages';

export const ruleRunner = (fieldName, fieldLabel, ...validation) => {
  // ...validation is an arr of funcs.
  // loop through and call each validator to get the error messages.
  for (let i = 0; i < validation.length; i++) {
    console.log(validation[i]);
  }
};
// // calls all the validation rule runners and aggregates their results
// // into a single object. Allows for the results of all the fields into one object.
export const run = (state, runners) =>
runners.reduce((memo, runner) => Object.assign(memo, runner(state)), {});
