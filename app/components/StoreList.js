'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ListView,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as sc from 'spatialconnect/native';
import StoreCell from './StoreCell';
import palette from '../style/palette';

class StoreList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  selectStore(store) {
    Actions.store({ storeInfo: store });
  }

  onRefresh() {
    this.setState({refreshing: true});
    sc.stores$().subscribe(action => {
      this.setState({refreshing: false});
      this.props.dispatch(action);
    });
  }

  renderSeparator(
    sectionID,
    rowID,
    adjacentRowHighlighted
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
      style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  }

  renderRow(
    store,
    sectionID,
    rowID,
    highlightRowFunc
  ) {
    return (
      <StoreCell
        key={store.id}
        onSelect={() => this.selectStore(store)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        store={store}
      />
    );
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.stores)}
          renderSeparator={this.renderSeparator.bind(this)}
          renderRow={this.renderRow.bind(this)}
          style={styles.listView}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        />
      </View>
    );
  }
}

StoreList.propTypes = {
  stores: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: palette.gray
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  listView: {

  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  }
});

export default StoreList;