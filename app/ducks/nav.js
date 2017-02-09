import * as sc from 'spatialconnect/native';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../AppNavigator';

export default (state, action) => {
  if (action.type === sc.Commands.AUTHSERVICE_LOGIN_STATUS) {
    if (action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED) {
      // authenticated, navigate to main navigator
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'AuthedNavigator',
          }),
        ],
      });
      return AppNavigator.router.getStateForAction(resetAction, state);
    }
    // not authenticated, navigate to login page
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'login',
        }),
      ],
    });
    return AppNavigator.router.getStateForAction(resetAction, state);
  }
  // add login route to stack
  if (action.type === 'LOGOUT') {
    const routes = [
      ...state.routes,
      { key: 'login', routeName: 'login' },
    ];
    return {
      ...state,
      routes,
      index: routes.length - 1,
    };
  }
  return AppNavigator.router.getStateForAction(action, state);
};
