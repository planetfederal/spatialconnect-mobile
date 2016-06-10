'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';

class FormCell extends Component {
  render() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.formName} numberOfLines={2}>
                {this.props.form.display_name}
              </Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    );
  }
}

FormCell.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onHighlight: PropTypes.func.isRequired,
  onUnhighlight: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
};

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  formName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 60,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
});

export default FormCell;