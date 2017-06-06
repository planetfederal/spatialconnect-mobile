import { _ } from 'lodash';

export function nanErr(fieldValue) {
  if (_.isNaN(fieldValue) === true) {
    return true;
  } else if (isNaN(fieldValue) === false) {
    return false;
  } else if (isNaN(fieldValue) === undefined) {
    console.log('SOMETHING WENT HORRIBLY WRONG :/');
  }
}
export function overMax(fieldValue, max) {
  if ((fieldValue > max) === true) {
    return true;
  } else if ((fieldValue > max) === false) {
    return false;
  } else if ((fieldValue > max) === undefined) {
    console.log('SOMETHING WENT HORRIBLY WRONG :/');
  }
}

export function underMin(fieldValue, min) {
  if ((fieldValue < min) === true) {
    return true;
  } else if ((fieldValue < min) === false) {
    return false;
  } else if ((fieldValue < min) === undefined) {
    console.log('SOMETHING WENT HORRIBLY WRONG :/');
  }
}

export function isReqNum(fieldValue) {
  if (fieldValue === 0) {
    return true;
  } else if (fieldValue === undefined) {
    console.log('SOMETHING WENT HORRIBLY WRONG :/');
  }
}

export function isReqStr(fieldValue) {
  if (_.isEmpty(fieldValue) === true){
    return true;
  } else if (_.isEmpty(fieldValue) === undefined) {
    console.log('SOMETHING WENT HORRIBLY WRONG :/');
  }
}
// this.setState({
//   notANumErr: `${field.field_label} must be a ${field.type}`,
//   overMaxErr: `${field.field_label} can not be over ${max}`,
//   overMinErr: `${field.field_label} can not be under ${min}`,
//   requiredErr: `${field.field_label} is required`,
// });
