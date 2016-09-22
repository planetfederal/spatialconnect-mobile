'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as scActions from '../ducks/sc';
import SCMap from '../components/SCMap';
import FeatureData from '../components/FeatureData';
import FeatureEdit from '../components/FeatureEdit';
import { navStyles } from '../style/style.js';

class MapNavigator extends Component {
  render() {
    var el;
    if (this.props.name === 'map') {
      el = <SCMap {...this.props} />;
    } else if (this.props.name === 'viewFeature') {
      el = <FeatureData {...this.props} />;
    } else if (this.props.name === 'editFeature') {
      el = <FeatureEdit {...this.props} />;
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
  stores: state.sc.stores,
  activeStores: state.sc.activeStores,
  features: state.sc.features,
  featureSet: state.sc.featureSet,
  updatedFeature: state.sc.updatedFeature,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(scActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MapNavigator);