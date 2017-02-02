import React, { PropTypes } from 'react';
import {
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MenuButton = props => (
  <Icon
    onPress={() => props.navigation.navigate('DrawerOpen')}
    name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
    size={30}
    style={{ paddingLeft: 10 }}
    color="#fff"
  />
);

MenuButton.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default MenuButton;
