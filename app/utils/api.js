/*global fetch*/
const API_URL = 'http://efc.boundlessgeo.com:8085/api/';
let api = {
  getFormData(form) {
    return fetch(API_URL + `forms/${form.id}/results`)
      .then((response) => response.json())
      .then(data => data.map(f => {
        f.form = form;
        return f;
      }));
  },
  getAllFormData() {
    return this.getForms()
      .then(forms => {
        return Promise.all(forms.map(this.getFormData));
      })
      .catch(err => {
        console.log(err);
      });
  },
  getFormById(id) {
    return fetch(API_URL + `forms/${id}`)
      .then((response) => response.json());
  },
  getForms() {
    return fetch(API_URL + 'forms')
      .then((response) => response.json());
  }
};

export default api;