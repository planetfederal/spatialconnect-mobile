'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as storeActions from '../actions/stores';
import StoreList from './StoreList';
import SCStore from './SCStore';
import { navStyles } from '../style/style.js';

class StoreNavigator extends Component {

  render() {
    var el;
    if (this.props.name === 'stores') {
      el = <StoreList stores={this.props.stores} actions={this.props.actions} />;
    } else if (this.props.name === 'store') {
      el = <SCStore storeInfo={this.props.storeInfo} />;
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

function mapStateToProps(state) {
  return {
    stores: state.stores,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(storeActions, dispatch) };
}

StoreNavigator.propTypes = {
  name: PropTypes.string.isRequired,
  stores: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  storeInfo: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreNavigator);