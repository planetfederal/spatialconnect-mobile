'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import transform from 'tcomb-json-schema';
import tcomb from 'tcomb-form-native';
import palette from '../style/palette';
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
    var f;
    if (this.state.location) {
      let gj = {
        geometry: {
          type: 'Point',
          coordinates: [
            this.state.location.lon,
            this.state.location.lat
          ]
        },
        properties: formData
      };
      f = sc.geometry('DEFAULT_STORE', this.props.formInfo.layer_name, gj);
    } else {
      f = sc.spatialFeature('DEFAULT_STORE', this.props.formInfo.layer_name, formData);
    }
    sc.createFeature(f.serialize()).first().subscribe((data) => {
      Actions.formSubmitted({ feature: data });
    });
  }

  onPress () {
    var value = this.refs.form.getValue();
    if (value) {
      this.saveForm(value);
    }
  }

  componentWillMount() {
    this.lastKnown = sc.lastKnownLocation().subscribe(data => {
      this.setState({location: data});
    });
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

  componentWillUnmount() {
    this.lastKnown.dispose();
    sc.disableGPS();
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
            <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor={palette.lightblue}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }
}

SCForm.propTypes = {
  formInfo: PropTypes.object.isRequired
};

var styles = StyleSheet.create({
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
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: palette.darkblue,
    borderColor: palette.darkblue,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

export default SCForm;
