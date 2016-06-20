'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as formActions from '../actions/forms';
import FormList from './FormList';
import FormSubmitted from './FormSubmitted';
import SCForm from './SCForm';
import { navStyles } from '../style/style.js';

class FormNavigator extends Component {

  render() {
    var el;
    if (this.props.name === 'forms') {
      el = <FormList forms={this.props.forms} actions={this.props.actions} />;
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

function mapStateToProps(state) {
  return {
    forms: state.forms,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(formActions, dispatch) };
}

FormNavigator.propTypes = {
  name: PropTypes.string.isRequired,
  formInfo: PropTypes.object,
  forms: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FormNavigator);