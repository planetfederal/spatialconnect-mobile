import React, { PropTypes } from 'react';
import { Platform, Text, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native';
import { StoreStatus } from 'react-native-spatialconnect';
import { cellStyles, listStyles } from '../style/style';

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
      text = (
        <Text style={cellStyles.cellDetailsOrange}>
          {`Downloading ${Math.floor(store.downloadProgress * 100)}%`}
        </Text>
      );
      break;
    default:
      return false;
  }
  return text ? <Text style={cellStyles.cellDetails} numberOfLines={1}>{text}</Text> : null;
};

const StoreCell = props => {
  let TouchableElement = TouchableHighlight;
  if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
  }
  return (
    <View>
      <TouchableElement onPress={props.onSelect}>
        <View style={cellStyles.cellRow}>
          <View style={cellStyles.textContainer}>
            <Text style={cellStyles.cellName} numberOfLines={2}>
              {props.store.name}
            </Text>
            {statusText(props.store)}
          </View>
        </View>
      </TouchableElement>
      <View style={listStyles.rowSeparator} />
    </View>
  );
};

StoreCell.propTypes = {
  onSelect: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
};

export default StoreCell;
