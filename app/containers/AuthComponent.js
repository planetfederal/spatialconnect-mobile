import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

const requireAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    if (props.auth.isAuthenticated) {
      return <Component {...props} />;
    }
    return <View />;
  };

  AuthenticatedComponent.propTypes = {
    auth: PropTypes.object.isRequired,
  };

  const mapStateToProps = state => ({
    auth: state.auth,
  });

  return connect(mapStateToProps)(AuthenticatedComponent);
};

export default requireAuth;
