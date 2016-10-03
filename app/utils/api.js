'use strict';
/*global fetch*/
import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';

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
  },
  syncStore(storeId, token) {
    var gpkgStorePath = Platform.OS === 'ios' ?
      RNFetchBlob.fs.dirs.DocumentDir  + '/' + storeId + '.gpkg':
      RNFetchBlob.fs.dirs.DocumentDir  + '/' + storeId;  //todo: update android to include .gpkg extension

      RNFetchBlob.fetch('POST', API_URL + 'sync', {
         'x-access-token': token,
         'Content-Type' : 'multipart/form-data',
        }, [
         { name:'repoName',   data:'my-new-repo'},
         { name:'geopackage', filename: 'geopackage', data: RNFetchBlob.wrap(gpkgStorePath) }
       ])
     .then(res => console.log(res))
     .catch(err => console.err(err));
   }
};

export default api;
