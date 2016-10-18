'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Platform,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import { cellStyles } from '../style/style.js';

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
          <View style={cellStyles.cellRow}>
            <View style={cellStyles.textContainer}>
              <Text style={cellStyles.cellName} numberOfLines={2}>
                {this.props.form.form_label}
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

export default FormCell;
