import React, { Component, PropTypes } from 'react';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-native-drawer';
import * as authActions from '../ducks/auth';
import SideMenu from '../components/SideMenu';

class SCDrawer extends Component {
  render() {
    const state = this.props.navigationState;
    const children = state.children;
    return (
      <Drawer
        ref="navigation"
        open={state.open}
        onOpen={() => Actions.refresh({ key: state.key, open: true })}
        onClose={() => Actions.refresh({ key: state.key, open: false })}
        type="displace"
        content={<SideMenu
          routes={this.props.routes} isAuthenticated={this.props.auth.isAuthenticated}
          actions={this.props.actions}
        />}
        tapToClose
        openDrawerOffset={0.5}
        panCloseMask={0.5}
        negotiatePan
        tweenDuration={100}
        tweenHandler={ratio => ({
          main: { opacity: Math.max(0.54, 1 - ratio) },
        })}
      >
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    );
  }
}

SCDrawer.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  navigationState: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  routes: state.routes,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(authActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SCDrawer);
