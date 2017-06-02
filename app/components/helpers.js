import SCForm from './SCForm';
import { _ } from 'lodash';
let err_arr = [];

export function nanErr(fieldValue) {
  _.isNaN(fieldValue) ? err_arr.push(nanErr) : null;
  console.log(err_arr[0]);
}
export function overMax(fieldValue, max) {
  (fieldValue > max) ? err_arr.push(overMax) : null;
}

export function overMin(fieldValue, min) {
  (fieldValue > min) ? err_arr.push(overMin) : null;
}

export function isReqNum(fieldValue) {
  fieldValue === 0 ? err_arr.push(isReqNum) : null;
}

export function isReqStr(fieldValue) {
  _.isEmpty(fieldValue) ? err_arr.push(isReqStr) : null;
}
