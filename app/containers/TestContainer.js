import React, { Component, PropTypes } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as testActions from '../ducks/tests';
import SCTest from '../components/SCTest';
import { navStyles } from '../style/style';
import MenuButton from '../components/MenuButton';

class TestContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Tests',
    headerLeft: <MenuButton navigation={navigation} />,
    drawerLabel: 'Tests',
    drawerIcon: () =>
      <Icon
        name={Platform.OS === 'ios' ? 'ios-build-outline' : 'md-build'}
        size={30}
        color="#fff"
        style={{ paddingRight: 10 }}
      />,
  });

  render() {
    return (
      <View style={navStyles.container}>
        <SCTest {...this.props} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  tests: state.tests,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(testActions, dispatch),
});

TestContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  tests: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestContainer);
