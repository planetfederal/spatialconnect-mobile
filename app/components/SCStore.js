import React, { PropTypes } from 'react';
import {
  ScrollView,
} from 'react-native';
import Property from './Property';
import { propertyListStyles } from '../style/style';

const SCStore = props => (
  <ScrollView style={propertyListStyles.container}>
    <Property name={'Name'} value={props.storeInfo.name} />
    <Property name={'Type'} value={props.storeInfo.type} />
    <Property name={'ID'} value={props.storeInfo.storeId} />
    {props.storeInfo.vectorLayers && props.storeInfo.vectorLayers.length ?
      <Property name={'Vector Layers'} value={props.storeInfo.vectorLayers.join('\n')} />
    : null}
    {props.storeInfo.rasterLayers && props.storeInfo.rasterLayers.length ?
      <Property name={'Raster Layers'} value={props.storeInfo.rasterLayers.join('\n')} />
    : null}
  </ScrollView>
);

SCStore.propTypes = {
  storeInfo: PropTypes.object.isRequired,
};

export default SCStore;
