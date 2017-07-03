import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RNButton from 'react-native-button';
import t from 'tcomb-form-native';
import * as authActions from '../ducks/auth';
import palette from '../style/palette';
import { navStyles, buttonStyles, routerStyles } from '../style/style';

const Form = t.form.Form;

const styles = StyleSheet.create({
  form: {
    backgroundColor: 'white',
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

const Login = t.struct({
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
  static navigationOptions = {
    headerTitle: 'Expedited Field Capability',
    headerStyle: routerStyles.navBar,
    headerTitleStyle: { fontSize: 18, width: 250 },
    headerTintColor: 'white',
    headerLeft: null,
    gesturesEnabled: false,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSignUpPress = this.onSignUpPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthenticating === true && nextProps.isAuthenticating === false) {
      if (nextProps.isAuthenticated !== true) {
        this.props.actions.authError();
      }
    }
  }

  onSignUpPress() {
    this.props.navigation.navigate('signUp');
  }

  onPress() {
    const value = this.form.getValue();
    if (value) {
      this.props.actions.login(value.email, value.password);
    }
  }

  onChange(value) {
    this.props.actions.onChangeLoginFormValue(value);
  }

  render() {
    return (
      <View style={navStyles.container}>
        <View style={styles.form}>
          {this.props.hasAuthError
            ? <Text style={styles.errorMessage}>Login failed: Invalid credentials</Text>
            : <Text />}
          <Form
            ref={ref => {
              this.form = ref;
            }}
            value={this.props.loginFormValue}
            type={Login}
            options={formOptions}
            onChange={this.onChange}
          />
          <RNButton
            style={buttonStyles.buttonText}
            containerStyle={buttonStyles.button}
            styleDisabled={buttonStyles.disabled}
            onPress={this.onPress}
            disabled={this.props.isAuthenticating}
          >
            {this.props.isAuthenticating ? 'Signing In...' : 'Sign In'}
          </RNButton>
        </View>
      </View>
    );
  }
}

LoginView.propTypes = {
  navigation: PropTypes.object.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  loginFormValue: PropTypes.object.isRequired,
  hasAuthError: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticating: state.auth.isAuthenticating,
  loginFormValue: state.auth.loginFormValue,
  isAuthenticated: state.auth.isAuthenticated,
  hasAuthError: state.auth.hasAuthError,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(authActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
