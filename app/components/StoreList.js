import React, { Component, PropTypes } from 'react';
import {
  FlatList,
  View,
} from 'react-native';
import * as sc from 'react-native-spatialconnect';
import StoreCell from './StoreCell';
import { listStyles } from '../style/style';

class StoreList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };

    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.setState({ refreshing: true });
    sc.stores$().take(1).subscribe((action) => {
      this.setState({ refreshing: false });
      this.props.dispatch(action);
    });
  }

  keyExtractor = item => item.storeId

  render() {
    return (
      <View style={listStyles.mainContainer}>
        <FlatList
          data={this.props.stores}
          renderItem={({ item }) =>
            <StoreCell store={item} onSelect={() => this.props.navigation.navigate('store', { store: item })} />
          }
          keyExtractor={this.keyExtractor}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
          style={listStyles.listView}
        />
      </View>
    );
  }
}

StoreList.propTypes = {
  stores: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default StoreList;
