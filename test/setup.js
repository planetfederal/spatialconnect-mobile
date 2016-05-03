/*globals global,window*/
require('babel-core/register')({
  presets: ['react-native'],
  plugins: ['rewire'],
  ignore: function(filename) {
    if (!(/\/node_modules\//).test(filename)) {
      return false; // if not in node_modules, we want to compile it
    } else if ((/\/node_modules\/react-native\//).test(filename)) {
      // its RN source code, so we want to compile it
      return false;
    } else if ((/\/node_modules\/tcomb-form-native\//).test(filename)) {
      return false;
    } else {
      // it's in node modules and NOT RN source code
      return true;
    }
  }
});
require.extensions['.ios.js'] = require.extensions['.js'];
require('react-native-mock/mock.js');
global.navigator = {
  product: 'ReactNative'
};
global.location = {};
window = global;