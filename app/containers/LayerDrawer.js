import React, { Component, PropTypes } from 'react';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-native-drawer';
import * as mapActions from '../ducks/map';
import LayerList from '../components/LayerList';

class LayerDrawer extends Component {
  render() {
    const nav = this.props.navigationState;
    const children = nav.children;
    return (
      <Drawer
        ref="navigation"
        open={nav.open}
        side="right"
        onOpen={()=>Actions.refresh({key:nav.key, open: true})}
        onClose={()=>Actions.refresh({key:nav.key, open: false})}
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
          main: { opacity:Math.max(0.54,1-ratio) },
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
  activeStores: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  stores: state.sc.stores,
  activeStores: state.map.activeStores,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(mapActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerDrawer);