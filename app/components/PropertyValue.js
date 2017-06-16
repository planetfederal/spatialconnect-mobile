import React, { Component, PropTypes } from 'react';
import { Image, Text } from 'react-native';
import { propertyListStyles } from '../style/style';

class PropertyValue extends Component {
  static isImage(v) {
    return typeof v === 'string' && v.indexOf('data:image/jpeg;base64') >= 0;
  }
  render() {
    const { value } = this.props;
    return PropertyValue.isImage(value)
      ? <Image style={propertyListStyles.base64} source={{ uri: value }} />
      : <Text style={propertyListStyles.valueText} ellipsizeMode={'tail'}>{value}</Text>;
  }
}

PropertyValue.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default PropertyValue;
