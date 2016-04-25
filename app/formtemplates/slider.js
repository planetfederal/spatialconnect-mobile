import React, {
  Text,
  View
} from 'react-native';

import Slider from 'react-native-slider';

export default function(locals) {
  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;

  function onChange(value) {
    locals.onChange(Math.round(value * 100) / 100);
  }

  return (
    <View style={formGroupStyle}>
      <Text style={controlLabelStyle}>{locals.label}</Text>
      <Slider
        value={locals.value}
        minimumValue={locals.config.minimum}
        maximumValue={locals.config.maximum}
        onValueChange={onChange} />
      <Text>Value: {locals.value}</Text>
    </View>
  );
}