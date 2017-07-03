import React, { Component, PropTypes } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import FormList from '../components/FormList';
import { navStyles } from '../style/style';
import MenuButton from '../components/MenuButton';

class FormContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Forms',
    headerLeft: <MenuButton navigation={navigation} />,
    drawerLabel: 'Forms',
    drawerIcon: () =>
      <Icon
        name={Platform.OS === 'ios' ? 'ios-filing-outline' : 'md-filing'}
        size={35}
        color="#fff"
        style={{ paddingRight: 10 }}
      />,
  });

  render() {
    return (
      <View style={navStyles.container}>
        <FormList {...this.props} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  forms: state.sc.forms,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

FormContainer.propTypes = {
  forms: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormContainer);
