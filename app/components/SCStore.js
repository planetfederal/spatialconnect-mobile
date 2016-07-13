'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import palette from '../style/palette';

class SCStore extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text numberOfLines={1}>
          Name: {this.props.storeInfo.name}
        </Text>
        <Text numberOfLines={1}>
          Type: {this.props.storeInfo.type}
        </Text>
        <Text numberOfLines={1}>
          Service: {this.props.storeInfo.service}
        </Text>
        <Text numberOfLines={0}>
          ID: {this.props.storeInfo.storeId}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: palette.gray
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline'
  }
});

SCStore.propTypes = {
  storeInfo: PropTypes.object.isRequired
};

export default SCStore;