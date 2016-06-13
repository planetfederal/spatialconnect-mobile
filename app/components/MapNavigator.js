'use strict';
import React, { Component } from 'react';
import {
  NavigatorIOS,
  StyleSheet,
} from 'react-native';

import SCMap from './SCMap';
import palette from '../style/palette';

class MapNavigator extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        barTintColor={palette.darkblue}
        tintColor={palette.gray}
        titleTextColor={'#fff'}
        translucent={false}
        initialRoute={{
          title: 'Map',
          component: SCMap,
        }}
      />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: palette.gray
  },
  nav: {
    height: 60
  },
  title: {
    marginTop: 6,
    fontSize: 16
  },
  leftNavButtonText: {
    fontSize: 18,
    marginLeft: 13,
    marginTop: 4
  },
  rightNavButtonText: {
    fontSize: 18,
    marginRight: 13,
    marginTop: 4
  }
});

export default MapNavigator;