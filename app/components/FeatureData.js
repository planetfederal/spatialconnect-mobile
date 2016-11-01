'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
} from 'react-native';
import { find } from 'lodash';
import { Actions } from 'react-native-router-flux';
import Property from './Property';
import { propertyListStyles } from '../style/style';

class FeatureData extends Component {
  //returns true if feature belongs to gpkg store
  isEditable(stores, feature) {
    if (!feature.metadata) return false;
    if (!feature.metadata.storeId) return false;
    let store = find(stores,
       s => s.storeId == feature.metadata.storeId
    );
    return store.type === 'gpkg';
  }
  //hide Edit button if feature is not editable
  componentDidMount() {
    if (this.isEditable(this.props.stores, this.props.feature)) {
      Actions.refresh({rightTitle: 'Edit'});
    } else {
      Actions.refresh({rightTitle: ''});
    }
  }
  renderMetadata() {
    let feature = this.props.feature;
    let metadata = [];
    metadata.push({ name: 'ID', value: feature.id });
    if (feature.metadata) {
      for (let key in feature.metadata) {
        metadata.push({ name: key, value: feature.metadata[key]});
      }
    }
    return <Property name={'Metadata'} values={metadata} />;
  }
  renderProperties() {
    let feature = this.props.feature;
    if (Object.keys(feature.properties).length) {
      let fields = [];
      for (let key in feature.properties) {
        fields.push({ name: key, value: feature.properties[key] });
      }
      return <Property name={'Properties'} values={fields} />;
    } else return null;
  }
  renderLocation() {
    let feature = this.props.feature;
    return (feature.geometry && feature.geometry.type === 'Point') ?
      <Property name={'Location'} values={[
        {name: 'Latitude', value: feature.geometry.coordinates[1]},
        {name: 'Longitude', value: feature.geometry.coordinates[0]}]} />
      : null;
  }
  render() {
    return (
      <ScrollView style={propertyListStyles.container}>
        {this.renderMetadata()}
        {this.renderLocation()}
        {this.renderProperties()}
      </ScrollView>
    );
  }
}

FeatureData.propTypes = {
  feature: PropTypes.object.isRequired,
  stores: PropTypes.array.isRequired,
};

export default FeatureData;