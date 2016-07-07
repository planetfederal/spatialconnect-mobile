'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import palette from '../style/palette';

class SCStore extends Component {

  goToMap() {
    Actions.storeMap({storeInfo: this.props.storeInfo});
  }

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
        <Text style={styles.link} onPress={this.goToMap.bind(this)}>View on Map</Text>
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

export default SCStore;