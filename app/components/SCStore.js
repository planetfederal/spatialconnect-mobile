'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
} from 'react-native';
import Property from './Property';
import { propertyListStyles } from '../style/style';

class SCStore extends Component {
  render() {
    return (
      <ScrollView style={propertyListStyles.container}>
        <Property name={'Name'} value={this.props.storeInfo.name} />
        <Property name={'Type'} value={this.props.storeInfo.type} />
        <Property name={'Service'} value={this.props.storeInfo.service} />
        <Property name={'ID'} value={this.props.storeInfo.storeId} />
        {this.props.storeInfo.layers.length ?
          <Property name={'Layers'} value={this.props.storeInfo.layers.join('\n')} />
        : null}
      </ScrollView>
    );
  }
}

SCStore.propTypes = {
  storeInfo: PropTypes.object.isRequired
};

export default SCStore;