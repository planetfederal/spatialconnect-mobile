'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import * as authActions from '../actions/auth';
import Button from 'react-native-button';
import t from 'tcomb-form-native';
import * as sc from 'spatialconnect/native';
import { navStyles, buttonStyles } from '../style/style';

let Form = t.form.Form;
t.form.Form.stylesheet.textbox.normal.backgroundColor = '#ffffff';
var Login = t.struct({
  email: t.String,
  password: t.String
});

var options = {
  fields: {
    password: {
      password: true,
      secureTextEntry: true
    }
  }
};

class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: {
        email: 'admin@something.com',
        password: 'admin'
      }
    };
  }

  onPress() {
    var value = this.refs.form.getValue();
    sc.authenticate(value.email, value.password);
    this.props.actions.loginUserRequest();
  }

  onChange(value) {
    this.setState({value});
  }

  render() {
    return (
      <View style={navStyles.container}>
        <View style={styles.form}>
          <Form
            ref="form"
            value={this.state.value}
            type={Login}
            options={options}
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
  statusText: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
  }
});

const mapStateToProps = (state) => ({
  isAuthenticating: state.auth.isAuthenticating,
  statusText: state.auth.statusText
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
