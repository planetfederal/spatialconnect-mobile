import React, { PropTypes } from 'react';
import {
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const LayersButton = props => (
  <Icon
    onPress={() => {
      const params = props.navigation.state.params;
      const open = params && params.open;
      props.navigation.setParams({ open: !open });
    }}
    name={'logo-buffer'}
    size={30}
    color="#fff"
    style={{ paddingRight: 10 }}
  />
);

LayersButton.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LayersButton;
