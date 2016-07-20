'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Platform,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';

import { cellStyles } from '../style/style.js';

class StoreCell extends Component {
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
                {this.props.store.name}
              </Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    );
  }
}

StoreCell.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onHighlight: PropTypes.func.isRequired,
  onUnhighlight: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired
};

export default StoreCell;