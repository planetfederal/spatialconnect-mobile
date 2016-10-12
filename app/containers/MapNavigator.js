'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mapActions from '../ducks/map';
import SCMap from '../components/SCMap';
import FeatureData from '../components/FeatureData';
import FeatureEdit from '../components/FeatureEdit';
import FeatureCreate from '../components/FeatureCreate';
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
    } else if (this.props.name === 'createFeature') {
      el = <FeatureCreate {...this.props} />;
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
};

const mapStateToProps = (state) => ({
  stores: state.sc.stores,
  activeStores: state.map.activeStores,
  features: state.map.features,
  overlays: state.map.overlays,
  creatingPoints: state.map.creatingPoints,
  creatingType: state.map.creatingType,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(mapActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapNavigator);