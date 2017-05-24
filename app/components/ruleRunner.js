export const ruleRunner = (fieldName, fieldLabel, ...validations) => {
  // ...validation is an arr of funcs.
  // loop through and call each validator to get the error messages.
  return (state) => {
    console.log('ruleRunner function');
    for (let v of validations) {
      console.log(fieldLabel);
      let errorMessageFunc = v(state[fieldName], state);
      if (errorMessageFunc) {
        console.log('errorMessageFunc in ruleRunner');
        return { [fieldName]: errorMessageFunc(fieldLabel) };
      }
    }
    return null;
  };
};

// // calls all the validation rule runners and aggregates their results
// // into a single object. Allows for the results of all the fields into one object.
export const run = (state, runners) =>
runners.reduce((memo, runner) => Object.assign(memo, runner(state)), {});