'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Picker,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find } from 'lodash';
import Button from 'react-native-button';
import { propertyListStyles, buttonStyles } from '../style/style';

class FeatureCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStoreId: null,
      selectedLayerId: null,
    };
  }

  onCreate() {
    this.props.actions.createFeature(this.state.selectedStoreId, this.state.selectedLayerId, this.props.feature);
  }

  onChangeStore(storeId) {
    let store = find(this.state.stores, s => s.storeId == storeId);
    this.setState({
      selectedStoreId: storeId,
      selectedLayerId: store.vectorLayers[0],
    });
  }

  componentWillMount() {
    const stores = this.props.stores.filter(s => (
      s.vectorLayers.length && s.type === 'gpkg'
    ));
    this.setState({
      stores: stores,
      selectedStoreId: stores.length ? stores[0].storeId : false,
      selectedLayerId: stores.length ? stores[0].vectorLayers[0] : false,
    });
  }

  render() {
    if (this.state.stores.length === 0) {
      return <View style={[propertyListStyles.container, styles.container]}>
        <Text>No valid stores.</Text>
        <Text>Add a Geopackage store to enable feature creation.</Text>
      </View>;
    }
    let store = find(this.state.stores, s => s.storeId == this.state.selectedStoreId);
    return (
      <View style={[propertyListStyles.container, styles.container]}>
        <Text>Choose Store</Text>
        <View style={styles.mask}>
          <Picker
            style={styles.picker}
            itemStyle={styles.item}
            selectedValue={this.state.selectedStoreId}
            onValueChange={this.onChangeStore.bind(this)}>
            {this.state.stores.map(s => (
              <Picker.Item key={s.storeId} label={s.name} value={s.storeId} />
            ))}
          </Picker>
        </View>
        <Text>Choose Layer</Text>
        <View style={styles.mask}>
          <Picker
            style={styles.picker}
            itemStyle={styles.item}
            selectedValue={this.state.selectedLayerId}
            onValueChange={layer => this.setState({selectedLayerId: layer})}>
            {store.vectorLayers.map(layer => (
              <Picker.Item key={layer} label={layer} value={layer} />
            ))}
          </Picker>
        </View>
        <Button style={buttonStyles.buttonText} containerStyle={buttonStyles.button} onPress={this.onCreate.bind(this)}>
          Create
        </Button>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  picker: {
    padding: 0,
    margin: 0,
    height: 100,
  },
  item: {
    flex: 1,
    height: 10,
    fontSize: 14,
  },
  mask: {
    height: 100,
    overflow: 'hidden',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});

FeatureCreate.propTypes = {
  feature: PropTypes.object.isRequired,
  stores: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

export default FeatureCreate;