import SCForm from './SCForm';
import { _ } from 'lodash';
let err_arr = [];

export function nanErr(fieldValue) {
  _.isNaN(fieldValue) ? this.state.notANumErr : null;
  console.log('nanErr ran');
}
export function overMax(fieldValue, max) {
  (fieldValue > max) ? this.state.overMaxErr : null;
  console.log('overMax ran');
}

export function underMin(fieldValue, min) {
  (fieldValue < min) ? this.state.overMinErr : null;
  console.log('overMin ran');
}

export function isReqNum(fieldValue) {
  fieldValue === 0 ? this.state.reqNumErr : null;
  console.log('isReqNum ran');
}

export function isReqStr(fieldValue) {
  _.isEmpty(fieldValue) ? this.state.reqStrErr : null;
  console.log('isReqStr ran');
}
// this.setState({ errMessObj:
//   notANumErr: `${field.field_label} must be a ${field.type}`,
//   overMaxErr: `${field.field_label} can not be over ${max}`,
//   overMinErr: `${field.field_label} can not be under ${min}`,
//   requiredErr: `${field.field_label} is required`,
// });
