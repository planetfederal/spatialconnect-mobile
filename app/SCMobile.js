/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  Image,
  Platform,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { connectSC } from './actions/sc';
import { requireAuth } from './containers/AuthComponent';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import SCDrawer from './containers/SCDrawer';
import FormNavigator from './containers/FormNavigator';
import StoreNavigator from './containers/StoreNavigator';
import MapNavigator from './containers/MapNavigator';
import TestNavigator from './containers/TestNavigator';
import palette from './style/palette';
import reducer from './reducers';

const store = createStore(
  reducer,
  applyMiddleware(thunk, createLogger())
);

class SCMobile extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    connectSC(store); //connect spatialconnect to the redux store
  }

  onLeft() {
    Actions.refresh({key: 'drawer', open: value => !value });
  }

  renderLeftButton() {
    return (
      <TouchableOpacity
        onPress={this.onLeft.bind(this)}>
        <Image source={require('./img/menu.png')}
       style={styles.icon} />
      </TouchableOpacity>
    );
  }

  render() {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    }
    return (
      <Provider store={store}>
        <Router
          navigationBarStyle={styles.navBar}
          titleStyle={styles.title}
          leftButtonIconStyle={styles.leftButtonIconStyle}
          renderLeftButton={this.renderLeftButton.bind(this)}
          duration={250}
          >
          <Scene key="root" hideNavBar hideTabBar>
            <Scene key="drawer" component={SCDrawer} open={false} initial={true}>
              <Scene key="main" tabs={true}>
                <Scene key="formNav" title="Form List">
                  <Scene key="forms" component={requireAuth(FormNavigator)} title="Forms"/>
                  <Scene key="form" component={requireAuth(FormNavigator)} title=""/>
                  <Scene key="formSubmitted" component={requireAuth(FormNavigator)} title="Form Submitted"/>
                </Scene>
                <Scene key="storeNav" title="Store List">
                  <Scene key="stores" component={requireAuth(StoreNavigator)} title="Stores"/>
                  <Scene key="store" component={requireAuth(StoreNavigator)} title=""/>
                </Scene>
                <Scene key="mapNav" title="Store List">
                  <Scene key="map" component={requireAuth(MapNavigator)} title="Map"/>
                  <Scene key="feature" component={requireAuth(MapNavigator)} title="Feature Data"/>
                </Scene>
                <Scene key="testNav" title="Tests">
                  <Scene key="test" component={requireAuth(TestNavigator)} title="Tests"/>
                </Scene>
                <Scene key="login" component={LoginView} title="Login"/>
                <Scene key="signUp" component={SignUpView} title="Sign Up"/>
              </Scene>
            </Scene>
          </Scene>
        </Router>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: palette.lightblue,
    height: (Platform.OS === 'ios') ? 64 : 44,
  },
  title: {
    color: 'white',
    fontSize: 20,
    marginTop: (Platform.OS === 'ios') ? 12 : -12,
  },
  leftButtonStyle: {

  },
  leftButtonTextStyle: {
    color: 'white',
    fontSize: 28,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: 'white',
    marginTop: (Platform.OS === 'ios') ? 32 : 12,
    marginLeft: 10,
  },
  leftButtonIconStyle: {
    tintColor: 'white',
  }
});

export default SCMobile;
