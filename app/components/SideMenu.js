import React, { PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import palette from '../style/palette';

const SideMenuButton = ({text, onPress, active}) => (
  <Button
    style={styles.navBtn}
    containerStyle={[styles.navBtnContainer, active && styles.navBtnContainerActive]}
    onPress={onPress}>{text}
  </Button>
);


const SideMenu = (props, context) => {
  const drawer = context.drawer;
  const key = props.routes.key;
  return (
    <View style={styles.container}>
      <View style={styles.navBtnWrap}>
        <View style={styles.titleWrap}>
          <Image source={require('../img/efc_app_87.png')} style={styles.icon} />
        </View>
        {props.isAuthenticated ?
          <View style={styles.navBtns}>
            <SideMenuButton active={key === 'formNav'} text="Forms" onPress={() => { drawer.close(); Actions.formNav(); }} />
            <SideMenuButton active={key === 'storeNav'} text="Stores" onPress={() => { drawer.close(); Actions.storeNav(); }} />
            <SideMenuButton active={key === 'mapNav'} text="Map" onPress={() => { drawer.close(); Actions.mapNav(); }} />
            <SideMenuButton active={key === 'testNav'} text="Tests" onPress={() => { drawer.close(); Actions.testNav(); }} />
            <SideMenuButton active={false} text="Logout" onPress={() => { drawer.close(); props.actions.logout(); }} />
          </View> :
          <View style={styles.navBtns}>
            <SideMenuButton active={key === 'login'} text="Login" onPress={() => { drawer.close(); Actions.login(); }} />
            <SideMenuButton active={key === 'signUp'} text="Sign Up" onPress={() => { drawer.close(); Actions.signUp(); }} />
          </View>
        }
      </View>
    </View>
  );
};

const contextTypes = {
  drawer: React.PropTypes.object,
};

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  routes: PropTypes.object.isRequired,
};

SideMenu.contextTypes = contextTypes;
SideMenu.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    paddingTop: 10,
    backgroundColor: '#1e2e47',
  },
  navBtns: {
    borderTopWidth: 1,
    borderTopColor: palette.darkblue,
  },
  navBtn: {
    color: palette.lightgray,
    textAlign: 'left',
    paddingLeft: 10,
  },
  navBtnContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.darkblue,
  },
  navBtnContainerActive: {
    backgroundColor: '#0f1723',
  },
  navBtnWrap: {
    marginLeft: 0,
    marginRight: 0,
  },
  titleWrap: {
    flexDirection: 'row',
  },
  icon: {
    height: 50,
    width: 50,
    margin: 10,
  },
  title: {
    marginTop: 8,
    color: 'white',
    fontSize: 16,
  },
});

export default SideMenu;