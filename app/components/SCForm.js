import React, { Component, PropTypes } from 'react';
import {
  Alert,
  Animated,
  InteractionManager,
  Keyboard,
  findNodeHandle,
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
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
});

class SCForm extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.form.form_label,
  });

  constructor(props) {
    super(props);
    this.state = {
      value: {},
      renderPlaceholderOnly: true,
      submitting: false,
    };
    this.keyboardHeight = new Animated.Value(0);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      const formInfo = this.props.navigation.state.params.form;
      const { schema, options, initialValues } = scformschema.translate({
        scSchema: formInfo,
        onFocus: this.onFocus,
      });
      this.setState({ schema, options, value: initialValues });
      this.TcombType = transform(schema);
      this.initialValues = initialValues;
      this.options = options;
      this.setState({ renderPlaceholderOnly: false });
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
      this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    });
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  onFocus(e) {
    let scrollResponder = this.scrollView.getScrollResponder();
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      findNodeHandle(e.target),
      150,
      true
    );
  }

  keyboardWillShow = event => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  };

  keyboardWillHide = event => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  };

  onSubmit() {
    const formData = this.form.getValue();
    if (formData) {
      this.setState({ submitting: true });
      this.saveForm(formData);
    }
  }

  onChange(value) {
    this.setState({ value });
  }

  saveForm(formData) {
    const formInfo = this.props.navigation.state.params.form;
    navigator.geolocation.getCurrentPosition(
      position => {
        const gj = {
          geometry: {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
          properties: formData,
        };
        const f = sc.geometry('FORM_STORE', formInfo.form_key, gj);
        sc.createFeature$(f).first().subscribe(this.formSubmitted.bind(this));
      },
      () => {
        const f = sc.spatialFeature('FORM_STORE', formInfo.form_key, { properties: formData });
        sc.createFeature$(f).first().subscribe(this.formSubmitted.bind(this));
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    );
  }

  formSubmitted() {
    this.setState({ submitting: false });
    Alert.alert('Form Submitted', '', [
      { text: 'OK' },
      { text: 'New Submission', onPress: () => this.setState({ value: this.initialValues }) },
    ]);
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return <PlaceHolder />;
    }
    return (
      <Animated.View style={[styles.container, { paddingBottom: this.keyboardHeight }]}>
        <ScrollView
          style={styles.scrollView}
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={true}
          ref={ref => {
            this.scrollView = ref;
          }}
        >
          <View style={styles.form}>
            <Form
              ref={ref => {
                this.form = ref;
              }}
              value={this.state.value}
              type={this.TcombType}
              options={this.options}
              onChange={this.onChange}
            />
            <Button
              style={buttonStyles.buttonText}
              containerStyle={buttonStyles.button}
              styleDisabled={buttonStyles.disabled}
              disabled={this.state.submitting}
              onPress={this.onSubmit}
            >
              {this.state.submitting ? 'Submitting' : 'Submit'}
            </Button>
          </View>
        </ScrollView>
      </Animated.View>
    );
  }
}

SCForm.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SCForm;
