import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../ducks/auth';
import SideMenu from '../components/SideMenu';

class DrawerContainer extends Component {
  render() {
    return <SideMenu {...this.props} />;
  }
}

DrawerContainer.propTypes = {

};

const mapStateToProps = state => ({
  auth: state.auth,
  routes: state.routes,
  isConnected: state.sc.connectionStatus,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(authActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);
