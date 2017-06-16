import React, { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';
import PropertyValue from './PropertyValue';
import { propertyListStyles } from '../style/style';

class Property extends Component {
  // values = [{name: foo, value: bar}]
  static renderValues(values) {
    return (
      <View>
        {values.map((prop, idx) =>
          <Text key={`${prop.name}.${idx}`}>
            <Text style={propertyListStyles.name}>{`${prop.name}\n`}</Text>
            <PropertyValue value={prop.value} />
          </Text>
        )}
      </View>
    );
  }
  render() {
    return (
      <View style={propertyListStyles.section}>
        <View style={propertyListStyles.sectionHead}>
          <Text style={propertyListStyles.sectionHeadText} numberOfLines={1}>
            {this.props.name}
          </Text>
        </View>
        <View style={propertyListStyles.values}>
          {this.props.value ? <PropertyValue value={this.props.value} /> : null}
          {this.props.values ? Property.renderValues(this.props.values) : null}
        </View>
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
