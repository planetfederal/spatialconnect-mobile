import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import LoginView from '../components/LoginView';

export const requireAuth = (Component) => {

  class AuthenticatedComponent extends Component {
    render() {
      if (this.props.auth.isAuthenticated) {
        return <Component {...this.props} />;
      } else {
        if (this.props.auth.isAuthenticating) {
          return <View />; //loading view
        } else {
          return <LoginView />;
        }
      }
    }
  }

  AuthenticatedComponent.propTypes = {
    auth: PropTypes.object.isRequired
  };

  const mapStateToProps = (state) => ({
    auth: state.auth
  });

  return connect(mapStateToProps)(AuthenticatedComponent);

};