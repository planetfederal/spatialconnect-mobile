'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Platform,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { StoreStatus } from 'spatialconnect/native';
import { cellStyles } from '../style/style.js';

const statusText = store => {
  let text;
  switch (store.status) {
    case StoreStatus.SC_DATASTORE_STARTED:
      text = <Text style={cellStyles.cellDetailsOrange}>Started</Text>;
      break;
    case StoreStatus.SC_DATASTORE_RUNNING:
      text = false;
      break;
    case StoreStatus.SC_DATASTORE_PAUSED:
      text = <Text style={cellStyles.cellDetailsOrange}>Paused</Text>;
      break;
    case StoreStatus.SC_DATASTORE_STOPPED:
      text = <Text style={cellStyles.cellDetailsRed}>Stopped</Text>;
      break;
    case StoreStatus.SC_DATASTORE_DOWNLOADINGDATA:
      text = <Text style={cellStyles.cellDetailsOrange}>
        {`Downloading ${Math.floor(store.downloadProgress*100)}%`}
      </Text>;
      break;
    default:
      return false;
  }
  return text ?
    <Text style={cellStyles.cellDetails} numberOfLines={1}>{text}</Text>
    : null;
};

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
              {statusText(this.props.store)}
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
  store: PropTypes.object.isRequired,
};

export default StoreCell;