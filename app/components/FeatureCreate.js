import React, { Component, PropTypes } from 'react';
import { Picker, StyleSheet, Text, View } from 'react-native';
import { find } from 'lodash';
import Button from 'react-native-button';
import { propertyListStyles, buttonStyles } from '../style/style';

const styles = StyleSheet.create({
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

class FeatureCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStoreId: null,
      selectedLayerId: null,
    };

    this.onChangeStore = this.onChangeStore.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  componentWillMount() {
    const params = this.props.navigation.state.params;
    const stores = params.stores.filter(
      s =>
        s.vectorLayers &&
        s.vectorLayers.length &&
        s.type === 'gpkg' &&
        s.storeId !== 'DEFAULT_STORE' &&
        s.storeId !== 'FORM_STORE' &&
        s.storeId !== 'LOCATION_STORE'
    );
    this.setState({
      stores,
      selectedStoreId: stores.length ? stores[0].storeId : false,
      selectedLayerId: stores.length ? stores[0].vectorLayers[0] : false,
    });
  }

  onCreate() {
    const params = this.props.navigation.state.params;
    params.actions.createFeature(
      this.state.selectedStoreId,
      this.state.selectedLayerId,
      params.feature
    );
  }

  onChangeStore(storeId) {
    const store = find(this.state.stores, s => s.storeId === storeId);
    this.setState({
      selectedStoreId: storeId,
      selectedLayerId: store.vectorLayers[0],
    });
  }

  render() {
    if (this.state.stores.length === 0) {
      return (
        <View style={[propertyListStyles.container, styles.container]}>
          <Text>No valid stores.</Text>
          <Text>Add a Geopackage store to enable feature creation.</Text>
        </View>
      );
    }
    const store = find(this.state.stores, s => s.storeId === this.state.selectedStoreId);
    return (
      <View style={[propertyListStyles.container, styles.container]}>
        <Text>Choose Store</Text>
        <View style={styles.mask}>
          <Picker
            style={styles.picker}
            itemStyle={styles.item}
            selectedValue={this.state.selectedStoreId}
            onValueChange={this.onChangeStore}
          >
            {this.state.stores.map(s =>
              <Picker.Item key={s.storeId} label={s.name} value={s.storeId} />
            )}
          </Picker>
        </View>
        <Text>Choose Layer</Text>
        <View style={styles.mask}>
          <Picker
            style={styles.picker}
            itemStyle={styles.item}
            selectedValue={this.state.selectedLayerId}
            onValueChange={layer => this.setState({ selectedLayerId: layer })}
          >
            {store.vectorLayers.map(layer =>
              <Picker.Item key={layer} label={layer} value={layer} />
            )}
          </Picker>
        </View>
        <Button
          style={buttonStyles.buttonText}
          containerStyle={buttonStyles.button}
          onPress={this.onCreate}
        >
          Create
        </Button>
      </View>
    );
  }
}

FeatureCreate.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default FeatureCreate;
