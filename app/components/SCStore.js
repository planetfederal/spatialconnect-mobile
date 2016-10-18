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
        <Property name={'ID'} value={this.props.storeInfo.storeId} />
        {this.props.storeInfo.vectorLayers && this.props.storeInfo.vectorLayers.length ?
          <Property name={'Vector Layers'} value={this.props.storeInfo.vectorLayers.join('\n')} />
        : null}
        {this.props.storeInfo.rasterLayers && this.props.storeInfo.rasterLayers.length ?
          <Property name={'Raster Layers'} value={this.props.storeInfo.rasterLayers.join('\n')} />
        : null}
      </ScrollView>
    );
  }
}

SCStore.propTypes = {
  storeInfo: PropTypes.object.isRequired,
};

export default SCStore;