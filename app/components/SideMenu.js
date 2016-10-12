import React, { Component, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import palette from '../style/palette';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActions from '../ducks/auth';

const SideMenuButton = ({text, onPress}) =>
  <Button style={styles.navBtn} containerStyle={styles.navBtnContainer} onPress={onPress}>{text}</Button>;

export class SideMenu extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navBtnWrap}>
          <View style={styles.titleWrap}>
            <Image source={require('../img/efc_app_87.png')} style={styles.icon} />
          </View>
          {this.props.isAuthenticated ?
            <View style={styles.navBtns}>
            <SideMenuButton text="Forms" onPress={() => { this.context.drawer.close(); Actions.formNav(); }} />
            <SideMenuButton text="Stores" onPress={() => { this.context.drawer.close(); Actions.storeNav(); }} />
            <SideMenuButton text="Map" onPress={() => { this.context.drawer.close(); Actions.mapNav(); }} />
            <SideMenuButton text="Tests" onPress={() => { this.context.drawer.close(); Actions.testNav(); }} />
            <SideMenuButton text="Logout" onPress={() => {this.context.drawer.close(); this.props.actions.logout(); }} />
            </View>
            :
            <View style={styles.navBtns}>
            <SideMenuButton text="Login" onPress={() => { this.context.drawer.close(); Actions.login(); }} />
            <SideMenuButton text="Sign Up" onPress={() => { this.context.drawer.close(); Actions.signUp(); }} />
            </View>
          }
        </View>
      </View>
    );
  }
}

const contextTypes = {
  drawer: React.PropTypes.object,
};

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

SideMenu.contextTypes = contextTypes;
SideMenu.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    paddingTop: 10,
    backgroundColor: palette.lightblue,
  },
  navBtns: {
    borderTopWidth: 1,
    borderTopColor: palette.lightgray,
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
    borderBottomColor: palette.lightgray,
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
  }
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
