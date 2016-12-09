import React, { PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as testActions from '../ducks/tests';
import SCTest from '../components/SCTest';
import { navStyles } from '../style/style';

const TestNavigator = (props) => {
  let el;
  if (props.name === 'test') {
    el = <SCTest tests={props.tests} actions={props.actions} />;
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
  tests: state.tests,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(testActions, dispatch),
});

TestNavigator.propTypes = {
  name: PropTypes.string.isRequired,
  tests: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestNavigator);
