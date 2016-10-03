'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find } from 'lodash';
import { Actions } from 'react-native-router-flux';
import palette from '../style/palette';

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
    metadata.push(<Text key='id'><Text style={styles.name}>ID:</Text> {feature.id}</Text>);
    if (feature.metadata) {
      for (let key in feature.metadata) {
        metadata.push(<Text key={key}>
          <Text style={styles.name}>{key}:</Text> {feature.metadata[key]}
          </Text>);
      }
    }
    return metadata;
  }
  renderProperties() {
    let feature = this.props.feature;
    let fields = [];
    for (let key in feature.properties) {
      let val = feature.properties[key];
      if (val
        && typeof val === 'string'
        && val.indexOf('data:image/jpeg;base64') >= 0) {
        fields.push(<Text key={key} style={styles.name}>{key}:</Text>);
        fields.push(<Image key={key+'_img'} style={styles.base64} source={{uri: val}} />);
      } else {
        fields.push(<Text key={key}><Text style={styles.name}>{key}:</Text> {val}</Text>);
      }
    }
    return fields;
  }
  renderLocation() {
    let feature = this.props.feature;
    let location = null;
    if (feature.geometry && feature.geometry.type === 'Point') {
      location = feature.geometry ? <View>
        <Text style={styles.subheader}>Location</Text>
        <Text>{feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}</Text></View> :
        <Text></Text>;
    }
    return location;
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.subheader}>Metadata</Text>
        {this.renderMetadata()}
        {this.renderLocation()}
        <Text style={styles.subheader}>Properties</Text>
        <View style={styles.properties}>
          {this.renderProperties()}
        </View>
      </ScrollView>
    );
  }
}

FeatureData.propTypes = {
  feature: PropTypes.object.isRequired,
  stores: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: '#fff'
  },
  subheader: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#000',
    borderBottomWidth: 1,
    textDecorationLine: 'underline',
  },
  properties: {
    flexDirection: 'column',
  },
  base64: {
    height: 100,
    width: 100,
    backgroundColor: 'red',
  },
  name: {
    fontWeight: 'bold'
  }
});

export default FeatureData;