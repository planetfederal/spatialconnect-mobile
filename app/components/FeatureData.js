import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  InteractionManager,
  ScrollView,
} from 'react-native';
import { find } from 'lodash';
import Property from './Property';
import { propertyListStyles, routerStyles } from '../style/style';

class FeatureData extends Component {
  static navigationOptions = ({ navigation }) => {
    return navigation.state.params.editable ? {
      headerRight: (<TouchableOpacity
        onPress={() => navigation.navigate('editFeature', { feature: navigation.state.params.feature })} >
        <Text style={routerStyles.buttonTextStyle}>Edit</Text>
        </TouchableOpacity>),
    } : {};
  }

  // returns true if feature belongs to gpkg store
  static isEditable(stores, feature) {
    if (!feature.metadata) return false;
    if (!feature.metadata.storeId) return false;
    const store = find(stores, s => s.storeId === feature.metadata.storeId);
    return store.type === 'gpkg';
  }
  // hide Edit button if feature is not editable
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { params } = this.props.navigation.state;
      const editable = FeatureData.isEditable(params.stores, params.feature);
      this.props.navigation.setParams({ editable });
    });
  }
  renderMetadata() {
    const feature = this.props.navigation.state.params.feature;
    const featureId = { name: 'ID', value: feature.id };
    let metadata = [];
    if (feature.metadata) {
      metadata = Object.keys(feature.metadata).map(key => (
        { name: key, value: feature.metadata[key] }
      ));
    }
    metadata.unshift(featureId);
    return <Property name={'Metadata'} values={metadata} />;
  }
  renderProperties() {
    const feature = this.props.navigation.state.params.feature;
    if (Object.keys(feature.properties).length) {
      const fields = Object.keys(feature.properties).map(key => (
        { name: key, value: feature.properties[key] }
      ));
      return <Property name={'Properties'} values={fields} />;
    }
    return null;
  }
  renderLocation() {
    const feature = this.props.navigation.state.params.feature;
    return (feature.geometry && feature.geometry.type === 'Point') ?
      <Property
        name={'Location'}
        values={[
          { name: 'Latitude', value: feature.geometry.coordinates[1] },
          { name: 'Longitude', value: feature.geometry.coordinates[0] },
        ]}
      />
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
  navigation: PropTypes.object.isRequired,
};

export default FeatureData;
