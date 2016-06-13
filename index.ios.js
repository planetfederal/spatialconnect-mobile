/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  TabBarIOS
} from 'react-native';

import FormNavigator from './app/components/FormNavigator';
import StoreNavigator from './app/components/StoreNavigator';
import MapNavigator from './app/components/MapNavigator';
import palette from './app/style/palette';
import * as sc from 'spatialconnect/native';

class SCMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'formNavigator'
    };
  }
  componentDidMount() {
    sc.startAllServices();
  }
  render() {
    return (
      <TabBarIOS
        selectedTab={this.state.selectedTab}
        barTintColor={palette.darkblue}
        tintColor={'#fff'}
        translucent={false}
        >
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'formNavigator'}
          title={'Forms'}
          onPress={() => {
            this.setState({
              selectedTab: 'formNavigator'
            });
          }}>
          <FormNavigator/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'storeList'}
          title={'Stores'}
          onPress={() => {
            this.setState({
              selectedTab: 'storeList'
            });
          }}>
          <StoreNavigator/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'map'}
          title={'Map'}
          onPress={() => {
            this.setState({
              selectedTab: 'map'
            });
          }}>
          <MapNavigator/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}


console.ignoredYellowBox = [
  'Warning: Failed propType',
  'Warning: ScrollView'
];

AppRegistry.registerComponent('SCMobile', () => SCMobile);
