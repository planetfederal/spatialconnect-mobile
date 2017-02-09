import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import StoreList from '../components/StoreList';
import { navStyles } from '../style/style';
import MenuButton from '../components/MenuButton';

class StoreContainer extends Component {
  static navigationOptions = {
    title: 'Stores',
    drawer: () => ({
      label: 'Stores',
    }),
    header: (navigation, defaultHeader) => {
      return {
        ...defaultHeader,
        left: <MenuButton navigation={navigation} />,
      };
    },
  }

  render() {
    return (
      <View style={navStyles.container}>
        <StoreList {...this.props} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  stores: state.sc.stores,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

StoreContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreContainer);
