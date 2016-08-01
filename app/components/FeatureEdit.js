'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import palette from '../style/palette';
import Button from 'react-native-button';
import { buttonStyles } from '../style/style';
import t from 'tcomb-form-native';
import transform from 'tcomb-json-schema';
import { omit } from 'lodash';

let Form = t.form.Form;


class FeatureEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {}
    };
  }

  save() {
    var value = this.refs.form.getValue();
    console.log(value);
    if (value) {

    }
  }

  onChange(value) {
    this.setState({value});
  }

  componentWillMount() {
    this.schema = {
      type: 'object',
      properties: {},
      required: []
    };
    this.options = {
      fields: {}
    };
    let properties = omit(this.props.feature.properties, 'bbox');
    for (let key in properties) {
      this.schema.properties[key] = { type: 'string' };
      this.schema.required.push(key);
      this.options.fields[key] = { label: key };
    }
    this.setState({ value: properties });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <Form
            ref="form"
            value={this.state.value}
            type={transform(this.schema)}
            options={this.options}
            onChange={this.onChange.bind(this)}
          />
        </View>
        <Button style={buttonStyles.buttonText} containerStyle={buttonStyles.button} onPress={this.save.bind(this)}>Save</Button>
      </ScrollView>
    );
  }
}

FeatureEdit.propTypes = {
  feature: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: palette.gray
  },
  subheader: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  form: {
    padding: 20
  }
});

export default FeatureEdit;