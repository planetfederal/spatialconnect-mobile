import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import StoreList from '../components/StoreList';
import SCStore from '../components/SCStore';
import { navStyles } from '../style/style';

const StoreNavigator = (props) => {
  let el;
  if (props.name === 'stores') {
    el = <StoreList {...props} />;
  } else if (props.name === 'store') {
    el = <SCStore {...props} />;
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
  stores: state.sc.stores,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

StoreNavigator.propTypes = {
  name: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreNavigator);
