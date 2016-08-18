'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import palette from '../style/palette';

class FeatureData extends Component {
  render() {
    let feature = this.props.feature;
    let metadata = [];
    if (feature.metadata) {
      for (let key in feature.metadata) {
        metadata.push(<Text key={key}>{key}: {feature.metadata[key]}</Text>);
      }
    }
    let fields = [];
    for (let key in feature.properties) {
      if (feature.properties[key].indexOf('data:image/jpeg;base64') >= 0) {
        fields.push(<Text key={key}>{key}:</Text>);
        fields.push(<Image key={key+'_img'} style={styles.base64} source={{uri: feature.properties[key]}} />);
      } else {
        fields.push(<Text key={key}>{key}: {feature.properties[key]}</Text>);
      }
    }
    let location = null;
    if (feature.geometry && feature.geometry.type === 'Point') {
      location = feature.geometry ?
        <Text>{feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}</Text> :
        <Text></Text>;
    }
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.subheader}>Metadata</Text>
        <Text>ID: {feature.id}</Text>
        {metadata}
        <Text style={styles.subheader}>Location</Text>
        {location}
        <Text style={styles.subheader}>Properties</Text>
        <View style={styles.properties}>
        {fields}
        </View>
      </ScrollView>
    );
  }
}

FeatureData.propTypes = {
  feature: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: palette.gray
  },
  subheader: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  properties: {
    flexDirection: 'column',
  },
  base64: {
    height: 100,
    width: 100,
    backgroundColor: 'red',
  },
});

export default FeatureData;