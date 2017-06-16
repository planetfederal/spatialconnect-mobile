import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { DrawerNavigator, StackNavigator, addNavigationHelpers } from 'react-navigation';
import t from 'tcomb-form-native';
import FormContainer from './containers/FormContainer';
import SCForm from './components/SCForm';
import StoreContainer from './containers/StoreContainer';
import SCStore from './components/SCStore';
import DrawerContainer from './containers/DrawerContainer';
import MapContainer from './containers/MapContainer';
import FeatureData from './components/FeatureData';
import FeatureEdit from './components/FeatureEdit';
import FeatureCreate from './components/FeatureCreate';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import SplashScreen from './components/SplashScreen';
import TestContainer from './containers/TestContainer';
import { routerStyles } from './style/style';

t.form.Form.stylesheet.textbox.normal.borderRadius = 2;
t.form.Form.stylesheet.textbox.error.borderRadius = 2;
t.form.Form.stylesheet.textbox.normal.backgroundColor = '#ffffff';
t.form.Form.stylesheet.textbox.error.backgroundColor = '#ffffff';
t.form.Form.stylesheet.helpBlock.normal.fontSize = 12;

const navigationOptions = {
  headerStyle: routerStyles.navBar,
  headerTintColor: 'white',
};

const FormNav = StackNavigator(
  {
    formList: { screen: FormContainer },
    form: { screen: SCForm },
  },
  {
    initialRouteName: 'formList',
    headerMode: 'screen',
    navigationOptions,
  }
);

const StoreNav = StackNavigator(
  {
    storeList: { screen: StoreContainer },
    store: { screen: SCStore },
  },
  {
    initialRouteName: 'storeList',
    headerMode: 'screen',
    navigationOptions,
  }
);

const MapNav = StackNavigator(
  {
    map: { screen: MapContainer },
    viewFeature: { screen: FeatureData },
    editFeature: { screen: FeatureEdit },
    createFeature: { screen: FeatureCreate },
  },
  {
    initialRouteName: 'map',
    initialRouteParams: { open: false },
    headerMode: 'screen',
    navigationOptions,
  }
);

const TestNav = StackNavigator(
  {
    tests: { screen: TestContainer },
  },
  {
    initialRouteName: 'tests',
    headerMode: 'screen',
    navigationOptions,
  }
);

const AuthedNavigator = DrawerNavigator(
  {
    formNav: { screen: FormNav },
    storeNav: { screen: StoreNav },
    mapNav: { screen: MapNav },
    testNav: { screen: TestNav },
  },
  {
    initialRouteName: 'formNav',
    contentComponent: DrawerContainer,
  }
);

const UnAuthedNavigator = StackNavigator(
  {
    login: { screen: LoginView },
    signUp: { screen: SignUpView },
  },
  {
    initialRouteName: 'login',
    headerMode: 'screen',
    navigationOptions,
  }
);

export const AppNavigator = StackNavigator(
  {
    splash: { screen: SplashScreen },
    AuthedNavigator: { screen: AuthedNavigator },
    UnAuthedNavigator: { screen: UnAuthedNavigator },
  },
  {
    initialRouteName: 'splash',
    headerMode: 'screen',
    mode: 'modal',
    navigationOptions: { header: null },
  }
);

const AppWithNavigationState = props =>
  <AppNavigator
    navigation={addNavigationHelpers({
      dispatch: props.dispatch,
      state: props.nav,
    })}
  />;

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
