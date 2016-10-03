'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import transform from 'tcomb-json-schema';
import tcomb from 'tcomb-form-native';
import palette from '../style/palette';
import { buttonStyles } from '../style/style';
import scformschema from 'spatialconnect-form-schema/native';
import * as sc from 'spatialconnect/native';

tcomb.form.Form.stylesheet.textbox.normal.backgroundColor = '#ffffff';
tcomb.form.Form.stylesheet.textbox.error.backgroundColor = '#ffffff';
tcomb.form.Form.stylesheet.helpBlock.normal.fontSize = 12;
transform.registerType('date', tcomb.Date);
transform.registerType('time', tcomb.Date);

let Form = tcomb.form.Form;

class SCForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: null,
      value: {}
    };
  }

  saveForm(formData) {
    navigator.geolocation.getCurrentPosition(position => {
      let gj = {
        geometry: {
          type: 'Point',
          coordinates: [
            position.coords.longitude,
            position.coords.latitude
          ]
        },
        properties: formData
      };
      let f = sc.geometry('FORM_STORE', this.props.formInfo.form_key, gj);
      sc.createFeature$(f.serialize()).first().subscribe(this.formSubmitted.bind(this));
    }, () => {
      let f = sc.spatialFeature('FORM_STORE', this.props.formInfo.form_key, formData);
      sc.createFeature$(f.serialize()).first().subscribe(this.formSubmitted.bind(this));
    },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  formSubmitted() {
    Alert.alert('Form Submitted', '', [
      {text: 'OK', onPress: () => Actions.pop()},
      {text: 'New Submission', onPress: () => this.setInitialValue(this.state.schema)},
    ]);
  }

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      this.saveForm(value);
    }
  }

  setInitialValue(schema) {
    let initialValues = {};
    for (let prop in schema.properties) {
      if (schema.properties[prop].hasOwnProperty('initialValue')) {
        initialValues[prop] = schema.properties[prop].initialValue;
      }
    }
    this.setState({value: initialValues});
  }

  componentWillMount() {
    let { schema, options } = scformschema.translate(this.props.formInfo);
    this.setState({ schema, options });
    this.setInitialValue(schema);
    this.TcombType = transform(schema);
    this.options = options;
  }

  onChange(value) {
    this.setState({value});
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <Form
              ref="form"
              value={this.state.value}
              type={this.TcombType}
              options={this.options}
              onChange={this.onChange.bind(this)}
            />
            <Button style={buttonStyles.buttonText} containerStyle={buttonStyles.button} onPress={this.onPress.bind(this)}>
              Submit
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

SCForm.propTypes = {
  formInfo: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  success: {
    flex: 1,
    padding: 10,
    backgroundColor: palette.gray
  },
  scrollView: {
    flex: 1,
  },
  formName: {
    backgroundColor: 'white',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: '#bbb',
    borderBottomWidth: 1
  },
  formNameText: {
    color: '#333',
    fontSize: 24
  },
  form: {
    backgroundColor: palette.lightgray,
    padding: 20,
    borderColor: palette.gray,
    borderBottomWidth: 1
  }
});

export default SCForm;
