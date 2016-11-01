import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

export const requireAuth = (Component) => {

  class AuthenticatedComponent extends Component {
    render() {
      if (this.props.auth.isAuthenticated) {
        return <Component {...this.props} />;
      } else {
        return <View />;
      }
    }
  }

  AuthenticatedComponent.propTypes = {
    auth: PropTypes.object.isRequired,
  };

  const mapStateToProps = (state) => ({
    auth: state.auth,
  });

  return connect(mapStateToProps)(AuthenticatedComponent);

};