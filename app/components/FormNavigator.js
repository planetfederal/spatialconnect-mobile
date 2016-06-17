'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import FormList from './FormList';
import FormSubmitted from './FormSubmitted';
import SCForm from './SCForm';
import { navStyles } from '../style/style.js';

class FormNavigator extends Component {
  render() {
    var el;
    if (this.props.name === 'forms') {
      el = <FormList />;
    } else if (this.props.name === 'form') {
      el = <SCForm formInfo={this.props.formInfo}/>;
    } else if (this.props.name === 'formSubmitted') {
      el = <FormSubmitted />;
    } else {
      el = <View />;
    }
    return (
      <View style={navStyles.container}>
        {el}
      </View>
    );
  }
}

FormNavigator.propTypes = {
  name: PropTypes.string.isRequired,
  formInfo: PropTypes.object
};

export default FormNavigator;