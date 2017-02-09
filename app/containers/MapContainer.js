import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-native-drawer';
import * as mapActions from '../ducks/map';
import SCMap from '../components/SCMap';
import { navStyles } from '../style/style';
import MenuButton from '../components/MenuButton';
import LayersButton from '../components/LayersButton';
import LayerList from '../components/LayerList';

class MapContainer extends Component {
  static navigationOptions = {
    title: 'Map',
    drawer: () => ({
      label: 'Map',
    }),
    header: (navigation, defaultHeader) => ({
      ...defaultHeader,
      left: <MenuButton navigation={navigation} />,
      right: <LayersButton navigation={navigation} />,
    }),
  }

  render() {
    const params = this.props.navigation.state.params;
    const open = params && params.open;
    return (
      <Drawer
        open={open}
        side="right"
        type="displace"
        content={<LayerList
          stores={this.props.stores}
          activeStores={this.props.activeStores}
          actions={this.props.actions}
        />}
        tapToClose
        openDrawerOffset={0.3}
        panCloseMask={0.3}
        negotiatePan
        tweenDuration={100}
        tweenHandler={ratio => ({
          main: { opacity: Math.max(0.54, 1 - ratio) },
        })}
      >
        <View style={navStyles.container}>
          <SCMap {...this.props} />
        </View>
      </Drawer>
    );
  }
}

MapContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  stores: PropTypes.array.isRequired,
  activeStores: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  stores: state.sc.stores,
  activeStores: state.map.activeStores,
  features: state.map.features,
  overlays: state.map.overlays,
  creatingPoints: state.map.creatingPoints,
  creatingType: state.map.creatingType,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(mapActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
