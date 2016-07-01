/*globals global,window,__dirname,require*/
import fs from 'fs';
import path from 'path';
import register from 'babel-core/register';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import mockery from 'mockery';
import Rx from 'rx';

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});
mockery.registerMock('react-native-router-flux', {Actions:{}});

mockery.registerMock('spatialconnect/native', {
  lastKnownLocation: () => new Rx.Subject(),
  createFeature: () => new Rx.Subject(),
});

// Ignore all node_modules except these
const modulesToCompile = [
  'react-native',
  'react-native-router-flux',
  'tcomb-form-native',
  'react-native-mock'
].map((moduleName) => new RegExp(`/node_modules/${moduleName}`));

const rcPath = path.join(__dirname, '..', '.babelrc');
const source = fs.readFileSync(rcPath).toString();
const config = JSON.parse(source);
config.ignore = function(filename) {
  if (!(/\/node_modules\//).test(filename)) {
    return false;
  } else {
    const matches = modulesToCompile.filter((regex) => regex.test(filename));
    const shouldIgnore = matches.length === 0;
    return shouldIgnore;
  }
};
config.plugins = ['rewire'];
register(config);

// Setup globals / chai
global.__DEV__ = true;
global.expect = chai.expect;
global.navigator = { product: 'ReactNative' };
global.location = {};
chai.use(chaiEnzyme());
// Setup mocks
require('react-native-mock/mock');
require.extensions['.ios.js'] = require.extensions['.js'];
window = global;
