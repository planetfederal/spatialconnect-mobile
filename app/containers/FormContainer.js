import React, { Component, PropTypes } from 'react';
import {
  View,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import FormList from '../components/FormList';
import { navStyles } from '../style/style';
import MenuButton from '../components/MenuButton';

class FormContainer extends Component {
  static navigationOptions = {
    title: 'Forms',
    drawer: () => ({
      label: 'Forms',
      icon: () => (
        <Icon
          name={Platform.OS === 'ios' ? 'ios-filing-outline' : 'md-filing'}
          size={35}
          color="#fff"
          style={{ paddingRight: 10 }}
        />
      ),
    }),
    header: (navigation, defaultHeader) => ({
      ...defaultHeader,
      left: <MenuButton navigation={navigation} />,
    }),
  }

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
