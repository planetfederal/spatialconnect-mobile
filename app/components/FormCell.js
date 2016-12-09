import React, { PropTypes } from 'react';
import {
  Platform,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import { cellStyles } from '../style/style';

const FormCell = (props) => {
  let TouchableElement = TouchableHighlight;
  if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
  }
  return (
    <View>
      <TouchableElement
        onPress={props.onSelect}
        onShowUnderlay={props.onHighlight}
        onHideUnderlay={props.onUnhighlight}
      >
        <View style={cellStyles.cellRow}>
          <View style={cellStyles.textContainer}>
            <Text style={cellStyles.cellName} numberOfLines={2}>
              {props.form.form_label}
            </Text>
          </View>
        </View>
      </TouchableElement>
    </View>
  );
};

FormCell.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onHighlight: PropTypes.func.isRequired,
  onUnhighlight: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
};

export default FormCell;

