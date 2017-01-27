import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import t from 'tcomb-form-native';
import * as authActions from '../ducks/auth';
import palette from '../style/palette';
import { navStyles, buttonStyles } from '../style/style';

const Form = t.form.Form;

const SignUp = t.struct({
  name: t.String,
  email: t.String,
  password: t.String,
});

const options = {
  fields: {
    name: {
      autoCapitalize: 'none',
      underlineColorAndroid: 'transparent',
    },
    email: {
      autoCapitalize: 'none',
      underlineColorAndroid: 'transparent',
    },
    password: {
      password: true,
      secureTextEntry: true,
      autoCapitalize: 'none',
      underlineColorAndroid: 'transparent',
    },
  },
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: palette.lightgray,
    padding: 20,
    borderColor: palette.gray,
    borderBottomWidth: 1,
  },
  errorMessage: {
    color: '#a94442',
    backgroundColor: '#f2dede',
    padding: 15,
    marginBottom: 15,
    borderColor: '#ebccd1',
    borderRadius: 4,
  },
});

export class SignUpView extends Component {

  static renderSuccessView() {
    return (
      <Text>Sign up successful.
        <Text style={buttonStyles.link} onPress={Actions.login}>Login</Text>
        with your new account.
      </Text>);
  }

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onPress() {
    const value = this.form.getValue();
    if (value) {
      this.props.actions.signUpUser(value);
    }
  }

  onChange(value) {
    this.props.actions.onChangeSignUpFormValue(value);
  }

  renderErrorView() {
    return <Text style={styles.errorMessage}>{ this.props.signUpError }</Text>;
  }

  render() {
    return (
      <View style={navStyles.container}>
        <View style={styles.form}>
          {this.props.signUpError ? <View>{ this.renderErrorView() }</View> : null}
          {this.props.signUpSuccess ? <View>{ SignUpView.renderSuccessView() }</View> :
          <View>
            <Form
              ref={(ref) => { this.form = ref; }}
              value={this.props.signUpFormValue}
              type={SignUp}
              options={options}
              onChange={this.onChange}
            />
            <Button
              disabled={this.props.isSigningUp} styleDisabled={buttonStyles.disabled}
              style={buttonStyles.buttonText} containerStyle={buttonStyles.button}
              onPress={this.onPress}
            >Sign Up</Button>
          </View> }
        </View>
      </View>
    );
  }
}

SignUpView.propTypes = {
  actions: PropTypes.object.isRequired,
  signUpError: PropTypes.string,
  signUpSuccess: PropTypes.bool.isRequired,
  isSigningUp: PropTypes.bool.isRequired,
  signUpFormValue: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  signUpError: state.auth.signUpError,
  signUpSuccess: state.auth.signUpSuccess,
  isSigningUp: state.auth.isSigningUp,
  signUpFormValue: state.auth.signUpFormValue,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(authActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpView);
