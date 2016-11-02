import { ActionConst } from 'react-native-router-flux';

const initialState = {
  scene: {},
  key: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionConst.FOCUS:
      return {
        ...state,
        scene: action.scene,
      };
    case ActionConst.JUMP:
      return {
        ...state,
        key: action.key,
      };
    default:
      return state;
  }
}