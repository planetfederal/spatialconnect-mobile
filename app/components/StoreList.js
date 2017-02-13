import React, { Component, PropTypes } from 'react';
import {
  ListView,
  RefreshControl,
  View,
} from 'react-native';
import * as sc from 'react-native-spatialconnect';
import StoreCell from './StoreCell';
import { listStyles } from '../style/style';

class StoreList extends Component {

  static renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    let style = listStyles.rowSeparator;
    if (adjacentRowHighlighted) {
      style = [style, listStyles.rowSeparatorHide];
    }
    return <View key={`SEP_${sectionID}_${rowID}`} style={style} />;
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };

    this.onRefresh = this.onRefresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  onRefresh() {
    this.setState({ refreshing: true });
    sc.stores$().take(1).subscribe((action) => {
      this.setState({ refreshing: false });
      this.props.dispatch(action);
    });
  }

  renderRow(store, sectionID, rowID, highlightRowFunc) {
    return (
      <StoreCell
        key={store.id}
        onSelect={() => this.props.navigation.navigate('store', { store })}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        store={store}
      />
    );
  }

  render() {
    return (
      <View style={listStyles.mainContainer}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.stores)}
          renderSeparator={StoreList.renderSeparator}
          renderRow={this.renderRow}
          style={listStyles.listView}
          enableEmptySections
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
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
