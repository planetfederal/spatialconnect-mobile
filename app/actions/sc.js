'use strict';
import * as sc from 'spatialconnect/native';

export const connectSC = store => {
  sc.startAllServices();
  sc.forms$().subscribe(store.dispatch);
  sc.stores$().subscribe(store.dispatch);
  sc.loginStatus$().subscribe(store.dispatch);
  sc.xAccessToken$().subscribe(store.dispatch);
};