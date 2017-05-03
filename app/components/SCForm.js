import React, { Component, PropTypes } from 'react';
import {
  Alert,
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from 'react-native-button';
import transform from 'tcomb-json-schema';
import tcomb from 'tcomb-form-native';
import scformschema from 'spatialconnect-form-schema/native';
import * as sc from 'react-native-spatialconnect';
import PlaceHolder from './PlaceHolder';
import palette from '../style/palette';
import { buttonStyles } from '../style/style';

transform.registerType('date', tcomb.Date);
transform.registerType('time', tcomb.Date);

const t = require('tcomb-validation');
const validate = t.validate;
const Form = tcomb.form.Form;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: palette.lightgray,
  },
  success: {
    flex: 1,
    padding: 10,
    backgroundColor: palette.gray,
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
    borderBottomWidth: 1,
  },
  formNameText: {
    color: '#333',
    fontSize: 24,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderColor: palette.gray,
    borderBottomWidth: 1,
  },
  err: {
    color: 'red',
  }
});

class SCForm extends Component {

  static navigationOptions = {
    title: ({ state }) => state.params.form.form_label,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: {},
      renderPlaceholderOnly: true,
      message: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
    this.errCheck = this.errCheck.bind(this);
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      const formInfo = this.props.navigation.state.params.form;
      const { schema, options, initialValues } = scformschema.translate(formInfo);
      this.setState({ schema, options, value: initialValues });
      this.TcombType = transform(schema);
      this.initialValues = initialValues;
      this.options = options;
      this.setState({ message: ''});
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  onPress() {
    const formData = this.form.getValue();
    if (formData) {
      this.saveForm(formData);

    }
  }

  onChange(value) {
    this.errCheck(value);
  }

  errCheck(value) {
    const formInfo = this.props.navigation.state.params.form;
    let n, s;
    let typeStr = formInfo['fields'][0]['type'];
    let typeNum = formInfo['fields'][1]['type'];

    if(formInfo['form_key'] === 'potholes'){

      typeStr = formInfo['fields'][0]['type'];
      severity = value['severity'];
      console.log(s);
    }

      if(formInfo['form_key'] === 'basic_data_collection'){
        // Value from occurences, should be numbers
        nValue = typeof value['occurences'];
        // Value from description, should be text or numbers
        sValue = typeof value['description'];

       if (sValue) {
         this.setState({ message: ''});
         s = value['description'];
         let min = formInfo['fields'][0]['constraints']['minimum_length'];

         if (sValue != typeStr || s.length < min || s.length <= 0){
          this.setState({ message: 'Please enter 5 or more characters for the description'});
        }
      }
      if (nValue) {
        let n = +value['occurences'];
        let max = formInfo['fields'][1]['constraints']['maximum'];

        if (isNaN(n) || n <= 0){
          console.log(value['occurences']);
          this.setState({ message: 'Numbers only please'});
        } else if (n > max) {
          this.setState({message: 'Occurences must be less than ' + max});
        }
      }
      this.setState({ value });
    }
      }


  saveForm(formData) {
    const formInfo = this.props.navigation.state.params.form;
    navigator.geolocation.getCurrentPosition((position) => {
      const gj = {
          geometry: {
          type: 'Point',
          coordinates: [
            position.coords.longitude,
            position.coords.latitude,
          ],
        },
        properties: formData,
      };
      const f = sc.geometry('FORM_STORE', formInfo.form_key, gj);
      sc.createFeature$(f).first().subscribe(this.formSubmitted.bind(this));
    }, () => {
      const f = sc.spatialFeature('FORM_STORE', formInfo.form_key, { properties: formData });
      sc.createFeature$(f).first().subscribe(this.formSubmitted.bind(this));
    }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
  }

  formSubmitted() {
    Alert.alert('Form Submitted', '', [
      { text: 'OK', onPress: () => this.props.navigation.goBack() },
      { text: 'New Submission', onPress: () => this.setState({ value: this.initialValues }) },
    ]);
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return <PlaceHolder />;
    }
    return (
      <View style={styles.container}>

        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <Form
              ref={(ref) => { this.form = ref; }}
              value={this.state.value}
              type={this.TcombType}
              options={this.options}
              onChange={this.onChange}
            />

            <Text style={styles.err}>{this.state.message}</Text>

            <Button
              style={buttonStyles.buttonText} containerStyle={buttonStyles.button}
              onPress={this.onPress}
            >
              Submit
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

SCForm.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SCForm;
