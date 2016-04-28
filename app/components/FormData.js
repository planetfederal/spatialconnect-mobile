'use strict';

import React, {
  Component,
  PropTypes,
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
    let location = this.props.form.location ?
      <Text>Location Submitted: {this.props.form.location.lat}, {this.props.form.location.lon}</Text> :
      <View/>;
    return (
      <View style={styles.container}>
        <Text>Form ID: {this.props.form.formID}</Text>
        {location}
        {fields}
      </View>
    );
  }
}

FormData.propTypes = {
  form: PropTypes.object.isRequired,
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: palette.gray
  }
});

export default FormData;