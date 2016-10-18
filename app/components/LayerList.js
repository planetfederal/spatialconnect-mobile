import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  View,
  Text,
} from 'react-native';
import palette from '../style/palette';

class LayerItem extends Component {
  render() {
    const { name, onValueChange, active } = this.props;
    return (
      <View style={styles.layerItem}>
        <Switch
          style={styles.layerItemSwitch}
          onValueChange={onValueChange}
          value={active} />
          <View style={styles.layerItemName}>
            <Text style={styles.layerItemText}>{name}</Text>
          </View>
      </View>
    );
  }
}

LayerItem.propTypes = {
  name: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

const LayerList = ({stores, activeStores, actions}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.navBtnWrap}>
        {stores.map(store => (
          <LayerItem
            key={store.storeId}
            name={store.name}
            onValueChange={(value) => actions.toggleStore(store.storeId, value)}
            active={activeStores.indexOf(store.storeId) >= 0} />
        ))}
      </View>
    </ScrollView>
  );
};

LayerList.contextTypes = {
  drawer: React.PropTypes.object,
};

LayerList.propTypes = {
  stores: PropTypes.array.isRequired,
  activeStores: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: palette.gray,
  },
  navBtn: {
    color: 'white',
    textAlign: 'left',
    fontSize: 16,
  },
  navBtnContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  navBtnWrap: {

  },
  layerItem: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  layerItemSwitch: {
    marginRight: 10,
  },
  layerItemName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  layerItemText: {
    fontSize: 12,
  },
});

export default LayerList;
