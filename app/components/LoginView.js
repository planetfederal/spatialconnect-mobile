'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import * as authActions from '../ducks/auth';
import Button from 'react-native-button';
import t from 'tcomb-form-native';
import palette from '../style/palette';
import { navStyles, buttonStyles } from '../style/style';

let Form = t.form.Form;

var Login = t.struct({
  email: t.String,
  password: t.String,
});

const formOptions = {
  fields: {
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

export class LoginView extends Component {

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      this.props.actions.login(value.email, value.password);
    }
  }

  onChange(value) {
    this.props.actions.onChangeLoginFormValue(value);
  }

  onSignUpPress() {
    Actions.signUp();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthenticating === true && nextProps.isAuthenticating === false) {
      if (nextProps.isAuthenticated !== true) {
        this.props.actions.authError();
      }
    }
  }

  render() {
    return (
      <View style={navStyles.container}>
        <View style={styles.form}>
          {this.props.hasAuthError ?
            <Text style={styles.errorMessage}>Login failed: Invalid credentials</Text> :
            <Text></Text>
          }
          <Form
            ref="form"
            value={this.props.loginFormValue}
            type={Login}
            options={formOptions}
            onChange={this.onChange.bind(this)}
          />
          <Button style={buttonStyles.buttonText} containerStyle={buttonStyles.button} onPress={this.onPress.bind(this)}>
            Login
          </Button>
          <Text onPress={this.onSignUpPress} style={buttonStyles.link}>Sign Up</Text>
        </View>
      </View>
    );
  }
}

LoginView.propTypes = {
  isAuthenticating: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  loginFormValue: PropTypes.object.isRequired,
  hasAuthError: PropTypes.bool.isRequired,
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

const mapStateToProps = (state) => ({
  isAuthenticating: state.auth.isAuthenticating,
  loginFormValue: state.auth.loginFormValue,
  isAuthenticated: state.auth.isAuthenticated,
  hasAuthError:  state.auth.hasAuthError,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(authActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
