import React, { Component, PropTypes } from 'react';
import { Alert, InteractionManager, ScrollView, StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import transform from 'tcomb-json-schema';
import tcomb from 'tcomb-form-native';
import { _ } from 'lodash/core';
import scformschema from 'spatialconnect-form-schema/native';
import * as sc from 'react-native-spatialconnect';
import PlaceHolder from './PlaceHolder';
import palette from '../style/palette';
import { buttonStyles } from '../style/style';
import * as Rules from './rules';
import { ruleRunner, run } from './ruleRunner';

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
      showErrors: false,
      validationErrors: {},
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
    let formInfo = this.props.navigation.state.params.form;
    let length = formInfo.fields.length;
    let fieldValue, fieldKey, max, min, isInt, isRequired, minLength;
    const fieldValidations = [];

    for (let i = 0; i < length; i++) {
      // input
      let type = formInfo.fields[i].type;
      let field = formInfo.fields[i];
      let constraints = formInfo.fields[i].constraints;
      fieldKey = formInfo.fields[i].field_key;
      fieldValue = value[formInfo.fields[i].field_key];
      if (fieldValue !== undefined) {
        if (field.type === 'number') {
          fieldValue = +[fieldValue];
          // check to see if field has a constraint. If it does then add the
          // validation. if not don't add it.
          // move this so it is reusable below for str cases.
          for (const key of Object.keys(constraints)) {
            switch (key) {
              case 'minimum':
                min = constraints[key];
                break;
              case 'maximum':
                max = constraints[key];
                break;
              case 'is_required':
                isRequired = constraints[key];
                break;
              case 'minimum_length':
                minLength = constraints[key];
            }
            // still needs attention here. Rules.mustBeANum needs modifying to check
            // the min, max, etc. 
          }
          const numRuleRunner = ruleRunner(field.field_key,
             field.field_label, Rules.mustBeANum(field.type, fieldValue));

            fieldValidations.push(numRuleRunner);
            this.setState({ value: value });
            const validationErrors = run(value, fieldValidations);

            // originally in a onSubmit function. Since we don't want to wait for
            // a submit. I included it below.
            this.setState({showErrors: true});
          if (_.isEmpty(this.state.validationErrors) === false) return null;
          // currently only working on type === number. NOT on type === string
        } else if (field.type === 'string') {
          // check constraints
          for (const key of Object.keys(constraints)) {
            switch (key) {
              case 'minimum':
                min = constraints[key];
                // constraintsArr.push(key, min);
                break;
              case 'maximum':
                max = constraints[key];
                break;
              case 'is_required':
                isRequired = constraints[key];
                break;
              case 'minimum_length':
                minLength = constraints[key];
            }
            const strMax = ruleRunner(field.field_key, field.field_label,
                Rules.strMax(max, value));
            fieldValidations.push(strMax);
            const strMin = ruleRunner(field.field_key, field.field_label,
                Rules.strMin(min, fieldValue));
            fieldValidations.push(strMin);
            run(this.state.value, fieldValidations);
          }
        }
      }
    }
  }
  saveForm(formData) {
    const formInfo = this.props.navigation.state.params.form;
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
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
              ref={(ref) => {
                this.form = ref;
              }}
              value={this.state.value}
              type={this.TcombType}
              options={this.options}
              onChange={this.onChange}
              showErrors={this.showErrors}
            />

            <Button
              style={buttonStyles.buttonText}
              containerStyle={buttonStyles.button}
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
