import React, { Component, PropTypes } from 'react';
import { FlatList, View } from 'react-native';
import * as sc from 'react-native-spatialconnect';
import FormCell from './FormCell';
import { listStyles } from '../style/style';

class FormList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };

    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.setState({ refreshing: true });
    sc.forms$().take(1).subscribe(action => {
      this.setState({ refreshing: false });
      this.props.dispatch(action);
    });
  }

  keyExtractor = item => item.id;

  render() {
    return (
      <View style={listStyles.mainContainer}>
        <FlatList
          data={this.props.forms}
          renderItem={({ item }) =>
            <FormCell
              form={item}
              onSelect={() => this.props.navigation.navigate('form', { form: item })}
            />}
          keyExtractor={this.keyExtractor}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
          style={listStyles.listView}
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
