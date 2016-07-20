/*global fetch*/
//const API_URL = 'http://localhost:8085/api/';
const API_URL = 'http://efc-dev.boundlessgeo.com/api/';
let api = {
  getFormData(form, token) {
    return fetch(API_URL + `forms/${form.id}/results`, {
      headers: { 'x-access-token': token }
    })
      .then((response) => response.json())
      .then(data => data.map(f => {
        f.form = form;
        return f;
      }));
  },
  getAllFormData(token) {
    return this.getForms(token)
      .then(forms => {
        return Promise.all(forms.map(form => this.getFormData(form, token)));
      })
      .catch(err => {
        console.log(err);
      });
  },
  getFormById(id) {
    return fetch(API_URL + `forms/${id}`)
      .then((response) => response.json());
  },
  getForms(token) {
    return fetch(API_URL + 'forms', {
      headers: { 'x-access-token': token }
    })
    .then((response) => response.json());
  },
  signUp(body) {
    if (!body) {
      body = {};
    }
    return fetch(API_URL + 'users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((response) => response.json());
  }
};

export default api;