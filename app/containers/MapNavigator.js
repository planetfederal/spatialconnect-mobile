import React, { PropTypes } from 'react';
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
import { navStyles } from '../style/style';

const MapNavigator = (props) => {
  let el;
  if (props.name === 'map') {
    el = <SCMap {...props} />;
  } else if (props.name === 'viewFeature') {
    el = <FeatureData {...props} />;
  } else if (props.name === 'editFeature') {
    el = <FeatureEdit {...props} />;
  } else if (props.name === 'createFeature') {
    el = <FeatureCreate {...props} />;
  } else {
    el = <View />;
  }
  return (
    <View style={navStyles.container}>
      {el}
    </View>
  );
};

MapNavigator.propTypes = {
  name: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  stores: state.sc.stores,
  activeStores: state.map.activeStores,
  features: state.map.features,
  overlays: state.map.overlays,
  creatingPoints: state.map.creatingPoints,
  creatingType: state.map.creatingType,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(mapActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapNavigator);
