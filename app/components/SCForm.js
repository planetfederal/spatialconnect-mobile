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
import validate from 'tcomb-validation'
import * as ErrorMessages from './rules';
transform.registerType('date', tcomb.Date);
transform.registerType('time', tcomb.Date);

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
      showErrors: false,
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
    var field_key, type, max, min, field_label;
    var newState = this.setState({
      showErrors: !this.state.showErrors,
      message: 'hard coded message'
    });
    // gets the value of what has been entered and expected type
    for(var i = 0; i < formInfo.fields.length; i++) {
      //input
      field_key = value[formInfo.fields[i].field_key];
      //expected type
      type = formInfo.fields[i].type;
      // max and min values. i.e. length of string or max # of occurences
      max = formInfo.fields[i].constraints.maximum;
      min = formInfo.fields[i].constraints.minimum;
      // if the field_key is expected to be a number, convert it to a number.
      // this is getting cumbersome... Find a better way to do this.
      if (type === 'number') {
        field_key = +[field_key];
      }
      //Weeds out anything that hasn't been filled in
      if (field_key != undefined) {
        //
        console.log(field_key);
        console.log(type);
        // if the field type should be number and it isn't. Error.
        if (type === 'number' && isNaN(field_key)) {
          console.log('Numbers only');
        }
      }
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
          <Text
            showErrors={this.state.showErrors}
            message={this.state.message}
            />

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
