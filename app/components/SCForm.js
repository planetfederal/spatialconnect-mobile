'use strict';
import React, { Component, PropTypes } from 'react';
import {
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
      let f = sc.geometry('DEFAULT_STORE', this.props.formInfo.layer_name, gj);
      sc.createFeature$(f.serialize()).first().subscribe((data) => {
        Actions.formSubmitted({ feature: data.payload });
      });
    }, (error) => {
      let f = sc.spatialFeature('DEFAULT_STORE', this.props.formInfo.layer_name, formData);
      sc.createFeature$(f.serialize()).first().subscribe((data) => {
        Actions.formSubmitted({ feature: data.payload });
      });
    },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      this.saveForm(value);
    }
  }

  componentWillMount() {
    let { schema, options } = scformschema.translate(this.props.formInfo);
    let initialValues = {};
    for (let prop in schema.properties) {
      if (schema.properties[prop].hasOwnProperty('initialValue')) {
        initialValues[prop] = schema.properties[prop].initialValue;
      }
    }
    this.setState({value: initialValues});
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
          <View style={styles.formName}>
            <Text style={styles.formNameText}>{this.props.formInfo.display_name}</Text>
          </View>
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
    padding: 20
  }
});

export default SCForm;
