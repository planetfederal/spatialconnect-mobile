/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';

import * as sc from 'spatialconnect/native';
import SCForm from './app/components/SCForm';

class SCMobile extends Component {

  constructor(props) {
   super(props);
   this.state = {
     form: null
   };
 }

  render() {
    return (
      <ScrollView>
        {this.state.form ? <SCForm formInfo={this.state.form} /> : <Text/>}
      </ScrollView>
    );
  }

  componentDidMount() {
    sc.startAllServices();
    sc.forms().subscribe(data => {
      this.setState({
        form: data.forms[0]  // only get the first form for now
      });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('SCMobile', () => SCMobile);
