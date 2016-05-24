/*global fetch*/
//const API_URL = 'http://localhost:3456/';
const API_URL = 'http://localhost:3000/api/';
let api = {
  getForm(formID) {
    return fetch(API_URL + 'forms/' + formID)
      .then((response) => response.json());
  },
  getFormList() {
    return fetch(API_URL + 'forms')
      .then((response) => response.json());
  },
  getFormData() {
    return fetch(API_URL + 'formData')
      .then((response) => response.json());
  },
  saveForm(formID, location, formData) {
    let body = {
      formID: formID,
      data: formData,
      location: location
    };
    return fetch(API_URL + 'formData', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
};

export default api;