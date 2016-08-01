'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import palette from '../style/palette';

class FeatureData extends Component {
  render() {
    console.log(this.props);
    let feature = this.props.feature;
    let metadata = [];
    if (feature.metadata) {
      for (let key in feature.metadata) {
        metadata.push(<Text key={key}>{key}: {feature.metadata[key]}</Text>);
      }
    }
    let fields = [];
    for (let key in feature.properties) {
      fields.push(<Text key={key}>{key}: {feature.properties[key]}</Text>);
    }
    let location = feature.geometry ?
      <Text>{feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}</Text> :
      <Text></Text>;
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.subheader}>Metadata</Text>
        {metadata}
        <Text style={styles.subheader}>Location</Text>
        {location}
        <Text style={styles.subheader}>Properties</Text>
        {fields}
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
  }
});

export default FeatureData;