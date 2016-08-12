import { AppRegistry } from 'react-native';
import SCMobile from './app/SCMobile';

console.ignoredYellowBox = [
  'Warning: Failed propType',
  'Warning: ScrollView',
  'Warning: You are manually calling a React.PropTypes validation',
];

AppRegistry.registerComponent('SCMobile', () => SCMobile);
