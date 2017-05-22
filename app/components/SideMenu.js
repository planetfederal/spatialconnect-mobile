import React, { Component, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import palette from '../style/palette';

const efcIcon = require('../img/efc_app_87.png');
const cIcon = require('../img/connected_icon.png');
const dIcon = require('../img/disconnected_icon.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e2e47',
    paddingTop: 15,
  },
  navBtns: {
    borderTopWidth: 1,
    borderTopColor: palette.darkblue,
  },
  navBtn: {
    color: palette.lightgray,
    textAlign: 'left',
    paddingLeft: 15,
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
    flex: 0.95,
  },
  titleWrap: {
    flexDirection: 'row',
  },
  icon: {
    height: 50,
    width: 50,
    margin: 10,
  },
  titleInner: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 11,
  },
  footerText: {
    color: palette.lightgray,
    fontSize: 16,
    paddingLeft: 10,
  },
  footer: {
    marginLeft: 0,
    marginRight: 0,
    flex: 0.05,
    flexDirection: 'row',
  },
  connectionIcon: {
    height: 20,
    width: 20,
    marginLeft: 10,
  },
  sideMenu: {
    flexDirection: 'row',
  },
  sideMenuTextWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideMenuText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sideMenuIcon: {
    marginLeft: 10,
    width: 35,
  },
});

const SideMenuButton = ({ text, icon, onPress, active }) => (
  <Button
    style={styles.navBtn}
    containerStyle={[styles.navBtnContainer, active && styles.navBtnContainerActive]}
    onPress={onPress}
  >
    <View style={styles.sideMenu}>
      <View style={styles.sideMenuIcon}>{icon}</View>
      <View style={styles.sideMenuTextWrap}>
        <Text style={styles.sideMenuText}>{text}</Text>
      </View>
    </View>
  </Button>
);

SideMenuButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

class SideMenu extends Component {

  renderRoutes() {
    const {
      navigation,
      activeTintColor,
      activeBackgroundColor,
      inactiveTintColor,
      inactiveBackgroundColor,
      getLabel,
      renderIcon } = this.props;
    return navigation.state.routes.map((route, index) => {
      const focused = navigation.state.index === index;
      const color = focused ? activeTintColor : inactiveTintColor;
      const scene = { route, index, focused, tintColor: color };
      const label = getLabel(scene);
      const icon = renderIcon(scene);
      return (
        <SideMenuButton
          active={focused}
          text={label}
          icon={icon}
          key={route.key}
          onPress={() => {
            navigation.navigate('DrawerClose');
            navigation.navigate(route.routeName);
          }}
        />
      );
    });
  }

  render() {
    const {
      isConnected,
      auth,
      actions } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.navBtnWrap}>
          <View style={styles.titleWrap}>
            <Image source={efcIcon} style={styles.icon} />
            <View style={styles.titleInner}>
              <Text style={styles.title}>EFC</Text>
            </View>
          </View>
          {auth.isAuthenticated ?
            <View style={styles.navBtns}>
              {this.renderRoutes()}
              <SideMenuButton
                active={false} text="Sign Out"
                icon={<Icon
                  name={Platform.OS === 'ios' ? 'ios-log-out' : 'md-log-out'}
                  size={30}
                  color="#fff"
                  style={{ paddingRight: 10 }}
                />}
                onPress={() => {
                  this.props.navigation.navigate('DrawerClose');
                  actions.logout();
                }}
              />
            </View> :
            this.renderRoutes()
          }
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}> Connection</Text>
          <Image source={isConnected ? cIcon : dIcon} style={styles.connectionIcon} />
        </View>
      </View>
    );
  }
}

const propTypes = {
  auth: PropTypes.object.isRequired,
  isConnected: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

SideMenu.propTypes = propTypes;

export default SideMenu;
