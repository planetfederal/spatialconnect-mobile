import { AppRegistry } from 'react-native';
import SCMobile from './app/SCMobile';

console.ignoredYellowBox = [
  'Warning: Failed propType',
  'Warning: ScrollView'
];

AppRegistry.registerComponent('SCMobile', () => SCMobile);
