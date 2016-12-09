import React, { PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import FormList from '../components/FormList';
import FormSubmitted from '../components/FormSubmitted';
import SCForm from '../components/SCForm';
import { navStyles } from '../style/style';

const FormNavigator = (props) => {
  let el;
  if (props.name === 'forms') {
    el = <FormList {...props} />;
  } else if (props.name === 'form') {
    el = <SCForm {...props} />;
  } else if (props.name === 'formSubmitted') {
    el = <FormSubmitted {...props} />;
  } else {
    el = <View />;
  }
  return (
    <View style={navStyles.container}>
      {el}
    </View>
  );
};

const mapStateToProps = state => ({
  forms: state.sc.forms,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

FormNavigator.propTypes = {
  name: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormNavigator);
