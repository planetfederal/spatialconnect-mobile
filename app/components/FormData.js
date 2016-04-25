'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import palette from '../style/palette';

class FormData extends Component {
  render() {
    let fields = [];
    for (var key in this.props.form.data) {
      fields.push(<Text key={key}>{key}: {this.props.form.data[key]}</Text>);
    }
    return (
      <View style={styles.container}>
        <Text>Form ID: {this.props.form.formID}</Text>
        <Text>Location Submitted: {this.props.form.location.lat}, {this.props.form.location.lon}</Text>
        {fields}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: palette.gray
  }
});

export default FormData;