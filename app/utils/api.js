/*global fetch*/
import * as sc from 'spatialconnect/native';
//const API_URL = 'http://localhost:3456/';
//const API_URL = 'http://localhost:3000/api/';
const API_URL = 'http://localhost:8085/';
let api = {
  getFormData() {
    return fetch(API_URL + 'formData')
      .then((response) => response.json());
  },
  saveForm(form, location, formData) {
    var f;
    if (location) {
      let gj = {
        geometry: {
          type: 'Point',
          coordinates: [
            location.lon,
            location.lat
          ]
        },
        properties: formData
      };
      f = sc.geometry('DEFAULT_STORE', form.layer_name, gj);
    } else {
      f = sc.spatialFeature('DEFAULT_STORE', form.layer_name, formData);
    }
    sc.createFeature(f.serialize()).subscribe((data) => {
      console.log('received newly created feature', data);
    });
  }
};

export default api;