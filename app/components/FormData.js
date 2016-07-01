'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import palette from '../style/palette';

class FormData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: false,
      form: false
    };
  }
  render() {
    let formData = this.props.formData;
    let metadata = [];
    for (var key in formData.val.metadata) {
      metadata.push(<Text key={key}>{key}: {formData.val.metadata[key]}</Text>);
    }
    let fields = [];
    for (var key in formData.val.properties) {
      fields.push(<Text key={key}>{key}: {formData.val.properties[key]}</Text>);
    }
    let location = formData.val.geometry ?
      <Text>{formData.val.geometry.coordinates[1]}, {formData.val.geometry.coordinates[0]}</Text> :
      <Text></Text>;
    return (
      <View style={styles.container}>
        <Text style={styles.subheader}>Form</Text>
        <Text>{formData.form.name}</Text>
        <Text style={styles.subheader}>Metadata</Text>
        {metadata}
        <Text style={styles.subheader}>Location</Text>
        {location}
        <Text style={styles.subheader}>Form Data</Text>
        {fields}
      </View>
    );
  }
}

FormData.propTypes = {
  formData: PropTypes.object.isRequired,
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

export default FormData;