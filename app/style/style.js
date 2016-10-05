import { Platform, StyleSheet } from 'react-native';
import palette from './palette';

export const cellStyles = StyleSheet.create({
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
    backgroundColor: '#fff',
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

export const navStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: (Platform.OS === 'ios') ? 65 : 55,
    backgroundColor: palette.white
  }
});

export const buttonStyles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: palette.lightblue,
    borderColor: palette.lightblue,
    borderWidth: 1,
    borderRadius: 5,
    margin: 0,
    padding: 5,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  disabled: {
    color: '#999'
  },
  link: {
    color: 'blue'
  }
});

export const propertyListStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: '#fff'
  },
  section: {
    paddingBottom: 10,
  },
  sectionHead: {
    borderColor: palette.gray,
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  sectionHeadText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  name: {
    fontWeight: 'bold',
  },
  base64: {
    height: 100,
    width: 100,
    backgroundColor: 'red',
  },
});

export const routerStyles = StyleSheet.create({
  navBar: {
    backgroundColor: palette.lightblue,
  },
  title: {
    color: 'white',
    fontWeight: 'bold'
  },
  leftButtonStyle: {

  },
  buttonTextStyle: {
    color: 'white',
  },
  icon: {
    left: 0,
    tintColor: 'white',
  },
  layersIcon: {
    right: 10,
    position: 'absolute',
  },
  layersIconImg: {
    tintColor: 'white',
  },
  leftButtonIconStyle: {
    tintColor: 'white',
  }
});