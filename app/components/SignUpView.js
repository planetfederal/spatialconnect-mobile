'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import * as authActions from '../actions/auth';
import Button from 'react-native-button';
import t from 'tcomb-form-native';
import { navStyles, buttonStyles } from '../style/style';

let Form = t.form.Form;
t.form.Form.stylesheet.textbox.normal.backgroundColor = '#ffffff';
t.form.Form.stylesheet.textbox.error.backgroundColor = '#ffffff';
var SignUp = t.struct({
  name: t.String,
  email: t.String,
  password: t.String
});

var options = {
  fields: {
    name: {
      autoCapitalize: 'none'
    },
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

class SignUpView extends Component {

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      this.props.actions.signUpUser(value);
    }
  }

  onChange(value) {
    this.props.actions.onChangeSignUpFormValue(value);
  }

  renderErrorView() {
    return <Text>{ this.props.signUpError }</Text>;
  }

  renderSuccessView() {
    return <Text>Sign up successful. <Text style={buttonStyles.link} onPress={Actions.login}>Login</Text> with your new account.</Text>;
  }

  render() {
    return (
      <View style={navStyles.container}>
        <View style={styles.form}>
          {this.props.signUpError ? <View>{ this.renderErrorView() }</View> : null}
          {this.props.signUpSuccess ? <View>{ this.renderSuccessView() }</View> :
           <View>
              <Form
                ref="form"
                value={this.props.signUpFormValue}
                type={SignUp}
                options={options}
                onChange={this.onChange.bind(this)}
              />
              <Button disabled={this.props.isSigningUp} styleDisabled={buttonStyles.disabled} style={buttonStyles.buttonText} containerStyle={buttonStyles.button} onPress={this.onPress.bind(this)}>Sign Up</Button>
            </View> }
          </View>
      </View>
    );
  }
}

SignUpView.propTypes = {
  actions: PropTypes.object.isRequired,
  signUpError: PropTypes.string.isRequired,
  signUpSuccess: PropTypes.bool.isRequired,
  isSigningUp: PropTypes.bool.isRequired,
  signUpFormValue: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
  }
});

const mapStateToProps = (state) => ({
  signUpError: state.auth.signUpError,
  signUpSuccess: state.auth.signUpSuccess,
  isSigningUp: state.auth.isSigningUp,
  signUpFormValue: state.auth.signUpFormValue
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpView);
