import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import FormList from '../components/FormList';
import { navStyles } from '../style/style';
import MenuButton from '../components/MenuButton';

class FormContainer extends Component {
  static navigationOptions = {
    title: 'Forms',
    drawer: () => ({
      label: 'Forms',
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
