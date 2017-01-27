import React, { Component } from 'react';
import {
  Image,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { Modal, Scene, Router, Actions } from 'react-native-router-flux';
import { connectSC } from './ducks/sc';
import requireAuth from './containers/AuthComponent';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import SCDrawer from './containers/SCDrawer';
import LayerDrawer from './containers/LayerDrawer';
import FormNavigator from './containers/FormNavigator';
import StoreNavigator from './containers/StoreNavigator';
import MapNavigator from './containers/MapNavigator';
import TestNavigator from './containers/TestNavigator';
import { routerStyles } from './style/style';
import palette from './style/palette';
import reducer from './ducks';

const RouterWithRedux = connect()(Router);

const store = createStore(
  reducer,
  applyMiddleware(thunk),
);

const layersImg = require('./img/layers.png');
const menuImg = require('./img/menu.png');

const renderLeftButton = () => (
  <TouchableOpacity
    onPress={() => Actions.refresh({ key: 'drawer', open: value => !value })}
  >
    <Image source={menuImg} style={routerStyles.icon} />
  </TouchableOpacity>
);

const renderLayersButton = () => (
  <TouchableOpacity
    style={routerStyles.layersIcon}
    onPress={() => Actions.refresh({ key: 'layerdrawer', open: value => !value })}
  >
    <Image source={layersImg} style={routerStyles.layersIconImg} />
  </TouchableOpacity>
);


const scenes = Actions.create(
  <Scene key="modal" component={Modal}>
    <Scene key="root" hideNavBar hideTabBar>
      <Scene key="drawer" component={SCDrawer} open={false} initial>
        <Scene key="layerdrawer" component={LayerDrawer} open={false}>
          <Scene key="main" tabs>
            <Scene key="formNav" title="Form List">
              <Scene
                key="forms" title="Forms"
                component={requireAuth(FormNavigator)}
                renderLeftButton={renderLeftButton}
              />
              <Scene
                key="form" title=""
                component={requireAuth(FormNavigator)}
                renderLeftButton={renderLeftButton}
              />
              <Scene
                key="formSubmitted" title="Form Submitted"
                component={requireAuth(FormNavigator)}
                renderLeftButton={renderLeftButton}
              />
            </Scene>
            <Scene key="storeNav" title="Store List">
              <Scene
                key="stores" title="Stores"
                component={requireAuth(StoreNavigator)}
                renderLeftButton={renderLeftButton}
              />
              <Scene
                key="store" title=""
                component={requireAuth(StoreNavigator)}
                renderLeftButton={renderLeftButton}
              />
            </Scene>
            <Scene key="mapNav" title="Store List">
              <Scene
                key="map" title="Map"
                component={requireAuth(MapNavigator)}
                renderLeftButton={renderLeftButton}
                renderRightButton={renderLayersButton}
              />
              <Scene
                key="viewFeature" title="Feature"
                component={requireAuth(MapNavigator)}
                renderLeftButton={renderLeftButton}
                rightTitle="Edit" rightButtonTextStyle={routerStyles.buttonTextStyle}
                onRight={props => Actions.editFeature({ feature: props.feature })}
              />
              <Scene
                key="editFeature" title="Edit Feature"
                component={requireAuth(MapNavigator)}
                panHandlers={null}
                rightTitle="Save" rightButtonTextStyle={routerStyles.buttonTextStyle}
                onRight={() => null}
                onLeft={() => Actions.pop()}
              />
              <Scene
                key="createFeature" title="Create Feature"
                component={requireAuth(MapNavigator)}
                direction="vertical" panHandlers={null}
              />
            </Scene>
            <Scene key="testNav" title="Tests">
              <Scene
                key="test" title="Tests"
                component={requireAuth(TestNavigator)}
                renderLeftButton={renderLeftButton}
              />
            </Scene>
            <Scene
              key="login" title="Login"
              component={LoginView}
              renderLeftButton={renderLeftButton}
            />
            <Scene
              key="signUp" title="Sign Up"
              component={SignUpView}
              renderLeftButton={renderLeftButton}
            />
          </Scene>
        </Scene>
      </Scene>
    </Scene>
  </Scene>);

class SCMobile extends Component {

  componentWillMount() {
    connectSC(store); // connect spatialconnect to the redux store
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    } else {
      StatusBar.setBackgroundColor(palette.lightblue, true);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux
          navigationBarStyle={routerStyles.navBar}
          titleStyle={routerStyles.title}
          leftButtonIconStyle={routerStyles.leftButtonIconStyle}
          duration={250}
          scenes={scenes}
        />
      </Provider>
    );
  }
}

export default SCMobile;
