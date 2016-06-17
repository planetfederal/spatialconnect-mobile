import { Platform, StyleSheet } from 'react-native';

const cellStyles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  cellName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 2,
    color: 'black'
  },
  cellRow: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 60,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
});

const navStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: (Platform.OS === 'ios') ? 65 : 45,
  }
});

export {
  cellStyles,
  navStyles
};