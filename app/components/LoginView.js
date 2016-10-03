'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import * as authActions from '../ducks/auth';
import Button from 'react-native-button';
import t from 'tcomb-form-native';
import * as sc from 'spatialconnect/native';
import palette from '../style/palette';
import { navStyles, buttonStyles } from '../style/style';

let Form = t.form.Form;

var Login = t.struct({
  email: t.String,
  password: t.String
});

var options = {
  fields: {
    email: {
      autoCapitalize: 'none'
    },
    password: {
      password: true,
      secureTextEntry: true,
      autoCapitalize: 'none'
    }
  }
};

export class LoginView extends Component {

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      sc.authenticate(value.email, value.password);
      this.props.actions.loginUserRequest();
    }
  }

  onChange(value) {
    this.props.actions.onChangeLoginFormValue(value);
  }

  onSignUpPress() {
    Actions.signUp();
  }

  render() {
    return (
      <View style={navStyles.container}>
        <View style={styles.form}>
          <Form
            ref="form"
            value={this.props.loginFormValue}
            type={Login}
            options={options}
            onChange={this.onChange.bind(this)}
          />
          <Button style={buttonStyles.buttonText} containerStyle={buttonStyles.button} onPress={this.onPress.bind(this)}>
            Login
          </Button>
        </View>
      </View>
    );
  }
}

LoginView.propTypes = {
  isAuthenticating: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  loginFormValue: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: palette.lightgray,
    padding: 20,
    borderColor: palette.gray,
    borderBottomWidth: 1,
  }
});

const mapStateToProps = (state) => ({
  isAuthenticating: state.auth.isAuthenticating,
  loginFormValue: state.auth.loginFormValue
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
