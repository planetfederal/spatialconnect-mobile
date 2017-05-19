export const ruleRunner = (fieldName, fieldLabel, ...validation) => {
  return;
}


// // calls all the validation rule runners and aggregates their results
// // into a single object. Allows for the results of all the fields into one object.
export const run = (state, runners) =>
runners.reduce((memo, runner) => Object.assign(memo, runner(state)), {});
