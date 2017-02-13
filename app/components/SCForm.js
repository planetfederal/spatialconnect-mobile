import React, { Component, PropTypes } from 'react';
import {
  Alert,
  InteractionManager,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Button from 'react-native-button';
import transform from 'tcomb-json-schema';
import tcomb from 'tcomb-form-native';
import scformschema from 'spatialconnect-form-schema/native';
import * as sc from 'react-native-spatialconnect';
import palette from '../style/palette';
import { buttonStyles } from '../style/style';

tcomb.form.Form.stylesheet.textbox.normal.backgroundColor = '#ffffff';
tcomb.form.Form.stylesheet.textbox.error.backgroundColor = '#ffffff';
tcomb.form.Form.stylesheet.helpBlock.normal.fontSize = 12;
transform.registerType('date', tcomb.Date);
transform.registerType('time', tcomb.Date);

const Form = tcomb.form.Form;

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
    backgroundColor: palette.lightgray,
    padding: 20,
    borderColor: palette.gray,
    borderBottomWidth: 1,
  },
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
    };

    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
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
    this.setState({ value });
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
      return <View />;
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
