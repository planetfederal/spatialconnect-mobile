import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { connectSC } from './ducks/sc';
import reducer from './ducks';
import AppWithNavigationState from './AppNavigator';
import palette from './style/palette';

const store = createStore(reducer, applyMiddleware(thunk));

connectSC(store); // connect spatialconnect to the redux store

class App extends Component {
  componentDidMount() {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    } else {
      StatusBar.setBackgroundColor(palette.lightblue, true);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default App;
