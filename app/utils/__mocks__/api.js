/*global process*/
let api = {
  signUp: (form) => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        return form ?
          resolve({success: true}) :
          resolve({success: false, error: 'error'});
      });
    });
  }
};

export default api;