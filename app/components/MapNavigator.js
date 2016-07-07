'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import SCMap from './SCMap';
import FeatureData from './FeatureData';
import { navStyles } from '../style/style.js';

class MapNavigator extends Component {
  render() {
    var el;
    if (this.props.name === 'map') {
      el = <SCMap />;
    } else if (this.props.name === 'feature') {
      el = <FeatureData feature={this.props.feature} />;
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

MapNavigator.propTypes = {
  name: PropTypes.string.isRequired
};

export default MapNavigator;