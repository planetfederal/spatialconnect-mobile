import React, { PropTypes } from 'react';
import {
  ScrollView,
} from 'react-native';
import Property from './Property';
import { propertyListStyles } from '../style/style';

const SCStore = (props) => {
  const store = props.navigation.state.params.store;
  return (
    <ScrollView style={propertyListStyles.container}>
      <Property name={'Name'} value={store.name} />
      <Property name={'Type'} value={store.type} />
      <Property name={'ID'} value={store.storeId} />
      {store.vectorLayers && store.vectorLayers.length ?
        <Property name={'Vector Layers'} value={store.vectorLayers.join('\n')} />
      : null}
      {store.rasterLayers && store.rasterLayers.length ?
        <Property name={'Raster Layers'} value={store.rasterLayers.join('\n')} />
      : null}
    </ScrollView>
  );
};

SCStore.navigationOptions = {
  title: ({ state }) => state.params.store.name,
};

SCStore.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SCStore;
