export const ruleRunner = (field, name, ...validations) => {
  return (state) => {
    for (let v of validations) {
      // coming back undefined
      let errorMessageFunc = v(state[field], state);
      if (errorMessageFunc) {
        console.log('errorMessageFunc in ruleRunner');
        return { [field]: errorMessageFunc(name) };
      }
    }
    return null;
  };
};
// // calls all the validation rule runners and aggregates their results
// // into a single object. Allows for the results of all the fields into one object.
export const run = (state, runners) =>
runners.reduce((memo, runner) => Object.assign(memo, runner(state)), {});
