'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ListView,
  StyleSheet,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FormCell from './FormCell';
import palette from '../style/palette';

class FormList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  selectForm(form) {
    Actions.form({ formInfo: form });
  }

  componentDidMount() {
    this.props.actions.loadForms();
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
      <View style={styles.mainContainer}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.forms)}
          renderSeparator={this.renderSeparator.bind(this)}
          renderRow={this.renderRow.bind(this)}
          style={styles.listView}
          enableEmptySections={true}
        />
      </View>
    );
  }
}

FormList.propTypes = {
  forms: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: palette.gray
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

export default FormList;