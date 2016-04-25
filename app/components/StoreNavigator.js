import React, {
  Component,
  NavigatorIOS,
  StyleSheet,
} from 'react-native';

import StoreList from './StoreList';
import palette from '../style/palette';

class StoreNavigator extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        barTintColor={palette.darkblue}
        tintColor={palette.gray}
        titleTextColor={'#fff'}
        translucent={false}
        initialRoute={{
          title: 'Store List',
          component: StoreList,
        }}
      />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: palette.gray
  },
  nav: {
    height: 60
  },
  title: {
    marginTop: 6,
    fontSize: 16
  },
  leftNavButtonText: {
    fontSize: 18,
    marginLeft: 13,
    marginTop: 4
  },
  rightNavButtonText: {
    fontSize: 18,
    marginRight: 13,
    marginTop: 4
  }
});

export default StoreNavigator;