'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ListView,
  RefreshControl,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as sc from 'spatialconnect/native';
import FormCell from './FormCell';
import { listStyles } from '../style/style';

class FormList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  selectForm(form) {
    Actions.form({ title: form.form_label, formInfo: form });
  }

  onRefresh() {
    this.setState({refreshing: true});
    sc.forms$().take(1).subscribe(action => {
      this.setState({refreshing: false});
      this.props.dispatch(action);
    });
  }

  renderSeparator(
    sectionID,
    rowID,
    adjacentRowHighlighted
  ) {
    var style = listStyles.rowSeparator;
    if (adjacentRowHighlighted) {
      style = [style, listStyles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  }

  renderRow(
    form,
    sectionID,
    rowID,
    highlightRowFunc
  ) {
    return (
      <FormCell
        key={form.id}
        onSelect={() => this.selectForm(form)}
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
          renderSeparator={this.renderSeparator.bind(this)}
          renderRow={this.renderRow.bind(this)}
          style={listStyles.listView}
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

FormList.propTypes = {
  forms: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default FormList;