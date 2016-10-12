'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Image,
  Text,
  View,
} from 'react-native';
import { propertyListStyles } from '../style/style';

class PropertyValue extends Component {
  isImage(v) {
    return (
      typeof v === 'string' &&
      v.indexOf('data:image/jpeg;base64') >= 0
    );
  }
  render() {
    const { value } = this.props;
    return this.isImage(value) ?
      <Image style={propertyListStyles.base64} source={{uri: value}} /> :
      <Text style={propertyListStyles.values}>{value}</Text>;
  }
}

PropertyValue.propTypes = {
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
};

class Property extends Component {
  //values = [{name: foo, value: bar}]
  renderValues(values) {
    return <View>
      {values.map((prop, idx) => (
        <Text key={prop.name+'.'+idx}>
          <Text style={propertyListStyles.name}>{prop.name}: </Text>
          <PropertyValue value={prop.value} />
        </Text>
      ))}
    </View>;
  }
  render() {
    return (
      <View style={propertyListStyles.section}>
        <View style={propertyListStyles.sectionHead}>
          <Text style={propertyListStyles.sectionHeadText}>{this.props.name}</Text>
        </View>
        {this.props.value ? <PropertyValue value={this.props.value} /> : null }
        {this.props.values ? this.renderValues(this.props.values) : null }
      </View>
    );
  }
}

Property.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  values: PropTypes.array,
};

export default Property;