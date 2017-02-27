import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

const PlaceHolder = () => (
  <View style={styles.container}>
    <ActivityIndicator
      animating
      style={{ height: 80 }}
    />
  </View>
);

export default PlaceHolder;
