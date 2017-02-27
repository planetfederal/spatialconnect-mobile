import { Platform, StyleSheet } from 'react-native';
import Color from 'color';
import palette from './palette';

export const listStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: palette.lightgray,
  },
  listView: {
    flex: 1,
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: palette.BORDER_COLOR,
    height: 1,
    marginLeft: 0,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

export const cellStyles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  cellName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 2,
    color: 'black',
  },
  cellRow: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
  },
  cellDetails: {
    fontSize: 10,
    color: palette.HELP_COLOR,
  },
  cellDetailsRed: {
    color: Color(palette.red).desaturate(0.7).fade(0).rgb().string(),
  },
  cellDetailsOrange: {
    color: Color(palette.orange).desaturate(0.7).fade(0).rgb().string(),
  },
  cellDetailsGreen: {
    color: Color(palette.green).desaturate(0.7).fade(0).rgb().string(),
  },
});

export const navStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 0,
    backgroundColor: palette.lightgray,
  },
});

export const buttonStyles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 46,
    backgroundColor: palette.lightblue,
    borderColor: palette.lightblue,
    borderWidth: 1,
    borderRadius: 2,
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  link: {
    color: 'blue',
  },
});

export const propertyListStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  section: {
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  sectionHead: {
    padding: 10,
    backgroundColor: palette.lightgray,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderColor: palette.BORDER_COLOR,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  values: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  valueText: {
    fontSize: 12,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  sectionHeadText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 12,
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
    fontWeight: 'bold',
  },
  leftButtonStyle: {

  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    paddingRight: 10,
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
  },
});
