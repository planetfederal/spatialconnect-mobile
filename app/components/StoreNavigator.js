'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import StoreList from './StoreList';
import SCStore from './SCStore';
import palette from '../style/palette';
import { navStyles } from '../style/style.js';

class StoreNavigator extends Component {
  render() {
    var el;
    if (this.props.name === 'stores') {
      el = <StoreList />;
    } else if (this.props.name === 'store') {
      el = <SCStore store={this.props.store}/>;
    } else {
      el = <View />;
    }
    return (
      <View style={navStyles.container}>
        {el}
      </View>
    );
  }
}

StoreNavigator.propTypes = {
  name: PropTypes.string.isRequired,
};

export default StoreNavigator;