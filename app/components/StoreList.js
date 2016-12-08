import React, { Component, PropTypes } from 'react';
import {
  ListView,
  RefreshControl,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as sc from 'spatialconnect/native';
import StoreCell from './StoreCell';
import { listStyles } from '../style/style';

class StoreList extends Component {

  static selectStore(store) {
    Actions.store({ title: store.name, storeInfo: store });
  }

  static renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    let style = listStyles.rowSeparator;
    if (adjacentRowHighlighted) {
      style = [style, listStyles.rowSeparatorHide];
    }
    return <View key={`SEP_${sectionID}_${rowID}`} style={style} />;
  }

  static renderRow(store, sectionID, rowID, highlightRowFunc) {
    return (
      <StoreCell
        key={store.id}
        onSelect={() => StoreList.selectStore(store)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        store={store}
      />
    );
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
  }

  onRefresh() {
    this.setState({ refreshing: true });
    sc.stores$().take(1).subscribe((action) => {
      this.setState({ refreshing: false });
      this.props.dispatch(action);
    });
  }

  render() {
    return (
      <View style={listStyles.mainContainer}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.stores)}
          renderSeparator={StoreList.renderSeparator}
          renderRow={StoreList.renderRow}
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
};

export default StoreList;
