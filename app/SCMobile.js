/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Platform,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import Drawer from './components/Drawer';
import FormNavigator from './components/FormNavigator';
import StoreNavigator from './components/StoreNavigator';
import MapNavigator from './components/MapNavigator';
import palette from './style/palette';
import * as sc from 'spatialconnect/native';

class SCMobile extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    sc.startAllServices();
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
      <Router
        navigationBarStyle={styles.navBar}
        titleStyle={styles.title}
        leftButtonIconStyle={styles.leftButtonIconStyle}
        renderLeftButton={this.renderLeftButton.bind(this)}
        duration={250}
        >
        <Scene key="root" hideNavBar hideTabBar>
          <Scene key="drawer" component={Drawer} open={false} initial={true}>
            <Scene key="main" tabs={true}>
              <Scene key="formNav" title="Form List">
                <Scene key="forms" component={FormNavigator} title="Forms"/>
                <Scene key="form" component={FormNavigator} title=""/>
                <Scene key="formSubmitted" component={FormNavigator} title="Form Submitted"/>
              </Scene>
              <Scene key="storeNav" title="Store List">
                <Scene key="stores" component={StoreNavigator} title="Store List"/>
                <Scene key="store" component={StoreNavigator} title=""/>
              </Scene>
              <Scene key="mapNav" title="Store List">
                <Scene key="map" component={MapNavigator} title="Map"/>
                <Scene key="formData" component={MapNavigator} title="Form Data"/>
              </Scene>
            </Scene>
          </Scene>
        </Scene>
      </Router>
    );
  }
}

var styles = StyleSheet.create({
  navBar: {
    backgroundColor: palette.darkblue,
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
