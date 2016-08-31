import React, { Component, PropTypes } from 'react';
import { Text } from 'react-native';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-native-drawer';
import * as scActions from '../ducks/sc';
import LayerList from '../components/LayerList';

class LayerDrawer extends Component {
  render() {
    const state = this.props.navigationState;
    const children = state.children;
    return (
      <Drawer
        ref="navigation"
        open={state.open}
        side="right"
        onOpen={()=>Actions.refresh({key:state.key, open: true})}
        onClose={()=>Actions.refresh({key:state.key, open: false})}
        type="displace"
        content={<LayerList
          stores={this.props.stores}
          activeStores={this.props.activeStores}
          actions={this.props.actions} />}
        tapToClose={true}
        openDrawerOffset={0.3}
        panCloseMask={0.3}
        negotiatePan={true}
        tweenDuration={100}
        tweenHandler={(ratio) => ({
          main: { opacity:Math.max(0.54,1-ratio) }
        })
      }>
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    );
  }
}

LayerDrawer.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  navigationState: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  stores: PropTypes.array.isRequired,
  activeStores: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  stores: state.sc.stores,
  activeStores: state.sc.activeStores
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(scActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerDrawer);