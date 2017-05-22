import * as sc from 'react-native-spatialconnect';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../AppNavigator';

export default (state, action) => {
  if (action.type === sc.Commands.AUTHSERVICE_LOGIN_STATUS) {
    if (action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED) {
      // authenticated, navigate to main navigator
      const resetAction = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({
            routeName: 'AuthedNavigator',
          }),
        ],
      });
      return AppNavigator.router.getStateForAction(resetAction, state);
    }
    const resetAction = NavigationActions.navigate({
      routeName: 'UnAuthedNavigator',
    });
    return AppNavigator.router.getStateForAction(resetAction, state);
  }
  return AppNavigator.router.getStateForAction(action, state);
};
