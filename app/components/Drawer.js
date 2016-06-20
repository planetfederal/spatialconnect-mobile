import React, { Component, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  View
} from 'react-native';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import Button from 'react-native-button';
import palette from '../style/palette';
import Drawer from 'react-native-drawer';

const SideMenu = (props, context) => {
  const drawer = context.drawer;
  return (
    <View style={styles.container}>
      <View style={styles.navBtnWrap}>
        <View style={styles.titleWrap}>
          <Image source={require('../img/efc_app_87.png')} style={styles.icon} />
        </View>
        <Button style={styles.navBtn} containerStyle={styles.navBtnContainer} onPress={() => { drawer.close(); Actions.formNav(); }}>Forms</Button>
        <Button style={styles.navBtn} containerStyle={styles.navBtnContainer} onPress={() => { drawer.close(); Actions.storeNav(); }}>Stores</Button>
        <Button style={styles.navBtn} containerStyle={styles.navBtnContainer} onPress={() => { drawer.close(); Actions.mapNav(); }}>Map</Button>
        <Button style={styles.navBtn} containerStyle={styles.navBtnContainer} onPress={() => { drawer.close(); Actions.testNav(); }}>Tests</Button>
      </View>
    </View>
  );
};

const contextTypes = {
  drawer: React.PropTypes.object,
};

const propTypes = {
  name: PropTypes.string,
  sceneStyle: View.propTypes.style,
  title: PropTypes.string,
};

SideMenu.contextTypes = contextTypes;
SideMenu.propTypes = propTypes;

class SCDrawer extends Component {
  render() {
    const state = this.props.navigationState;
    const children = state.children;
    return (
      <Drawer
        ref="navigation"
        open={state.open}
        onOpen={()=>Actions.refresh({key:state.key, open: true})}
        onClose={()=>Actions.refresh({key:state.key, open: false})}
        type="displace"
        content={<SideMenu />}
        tapToClose={true}
        openDrawerOffset={0.5}
        panCloseMask={0.5}
        negotiatePan={true}
        tweenDuration={100}
        tweenHandler={(ratio) => ({
          main: { opacity:Math.max(0.54,1-ratio) }
        })
      }>
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    );
  }
}

SCDrawer.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  navigationState: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    paddingTop: 30,
    backgroundColor: palette.darkblue,
  },
  navBtn: {
    color: 'white',
    textAlign: 'left',
    fontSize: 16,
  },
  navBtnContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  navBtnWrap: {
    marginLeft: 15,
    marginRight: 15,
  },
  titleWrap: {
    flexDirection: 'row',
  },
  icon: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
  title: {
    marginTop: 8,
    color: 'white',
    fontSize: 16,
  }
});

export default SCDrawer;