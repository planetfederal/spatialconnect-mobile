'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import FormList from '../components/FormList';
import FormSubmitted from '../components/FormSubmitted';
import SCForm from '../components/SCForm';
import { navStyles } from '../style/style.js';

class FormNavigator extends Component {

  render() {
    console.log(this.props);
    var el;
    if (this.props.name === 'forms') {
      el = <FormList {...this.props} />;
    } else if (this.props.name === 'form') {
      el = <SCForm {...this.props} />;
    } else if (this.props.name === 'formSubmitted') {
      el = <FormSubmitted {...this.props} />;
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

const mapStateToProps = (state) => ({
  forms: state.sc.forms
});

FormNavigator.propTypes = {
  name: PropTypes.string.isRequired,
  formInfo: PropTypes.object,
  forms: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(FormNavigator);