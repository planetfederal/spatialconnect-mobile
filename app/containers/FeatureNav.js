'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import FeatureData from '../components/FeatureData';
import FeatureEdit from '../components/FeatureEdit';
import { navStyles } from '../style/style.js';

class FeatureNav extends Component {
  render() {
    var el;
    if (this.props.name === 'viewFeature') {
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

FeatureNav.propTypes = {
  name: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(FeatureNav);