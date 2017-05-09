// original code from https://github.com/ok2ju/react-form-validation
//article about code https://spin.atomicobject.com/2016/10/05/form-validation-react/
// Function that returns a function.
//takes the updated state and runs the specified validations against said state.
export const ruleRunner = (field, name, ...validations) => {
  return (state) => {
    for (let v  of validations) {
      let errorMessageFunc = v(state[field], state);
      if (errorMessageFunc) {
        return {[field]: errorMessageFunc(name)};
      }
    }
    return null;
  };
};

//calls all the validation rule runners and aggregates their results
// into a single object. Allows for the results of all the fields into one object.
export const run = (state, runners) => {
  return runners.reduce((memo, runner) => {
    return Object.assign(memo, runner(state));
  }, {});
};
