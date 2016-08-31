'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import SCMap from '../components/SCMap';
import FeatureData from '../components/FeatureData';
import { navStyles } from '../style/style.js';

class MapNavigator extends Component {
  render() {
    var el;
    if (this.props.name === 'map') {
      el = <SCMap {...this.props} />;
    } else if (this.props.name === 'viewFeature') {
      el = <FeatureData {...this.props} />;
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
  name: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  activeStores: state.sc.activeStores,
});

export default connect(mapStateToProps)(MapNavigator);