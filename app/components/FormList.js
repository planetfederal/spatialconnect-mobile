import React, { Component, PropTypes } from 'react';
import {
  ListView,
  RefreshControl,
  View,
} from 'react-native';
import * as sc from 'react-native-spatialconnect';
import FormCell from './FormCell';
import { listStyles } from '../style/style';

class FormList extends Component {

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
    sc.forms$().take(1).subscribe((action) => {
      this.setState({ refreshing: false });
      this.props.dispatch(action);
    });
  }

  renderRow(form, sectionID, rowID, highlightRowFunc) {
    return (
      <FormCell
        key={form.id}
        onSelect={() => this.props.navigation.navigate('form', { form })}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        form={form}
      />
    );
  }

  render() {
    return (
      <View style={listStyles.mainContainer}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.forms)}
          renderSeparator={FormList.renderSeparator}
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

FormList.propTypes = {
  navigation: PropTypes.object.isRequired,
  forms: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default FormList;
