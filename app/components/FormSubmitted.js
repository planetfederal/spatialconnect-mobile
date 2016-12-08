import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import palette from '../style/palette';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: palette.gray,
  },
  subheader: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
});

const FormSubmitted = () => (
  <View style={styles.container}>
    <Text style={styles.subheader}>Form submitted.</Text>
  </View>
);

FormSubmitted.propTypes = {

};

export default FormSubmitted;
