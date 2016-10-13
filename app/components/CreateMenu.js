'use strict';
import React, { Component } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Color from 'color';
import palette from '../style/palette';

const MAIN_BUTTON_WIDTH = 50;
const BUTTON_WIDTH = 40;
const BUTTON_PADDING = 10;
const ANIMATION_DURATION = 400;

class CreateMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightPosition: new Animated.Value(0),
      topPosition: new Animated.Value(0),
      topPositionAdd: new Animated.Value(0),
      errorPosition: new Animated.Value(5),
      open: false,
      activeTool: false,
    };
  }

  animateMenu() {
    if (this.state.open) {
      this.props.cancelCreating();
      this.closeMenu();
    } else {
      this.state.rightPosition.setValue(0);
      Animated.timing(this.state.rightPosition, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.elastic(2),
      }).start();
    }
    this.setState({
      open: !this.state.open,
      activeTool: false,
    });
  }

  setActiveTool(tool) {
    this.props.addFeatureType(tool);
    if (this.state.activeTool) {
      //close
      Animated.sequence([
        Animated.parallel([
          Animated.timing(this.state.topPosition, {
            toValue: 0,
            duration: ANIMATION_DURATION/2,
            easing: Easing.elastic(1),
          }),
          Animated.timing(this.state.topPositionAdd, {
            toValue: 0,
            duration: ANIMATION_DURATION/2,
            easing: Easing.elastic(1),
          }),
        ]),
        Animated.parallel([
          Animated.timing(this.state.topPosition, {
            toValue: 1,
            duration: ANIMATION_DURATION/2,
            easing: Easing.elastic(1),
          }),
          Animated.timing(this.state.topPositionAdd, {
            toValue: tool === 'pin' ? 0 : 1,
            duration: ANIMATION_DURATION/2,
            easing: Easing.elastic(1),
          }),
        ]),
      ]).start();
    } else {
      this.props.addCenterPin();
      Animated.timing(this.state.topPosition, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.elastic(2),
      }).start();
      if (tool !== 'pin') {
        Animated.timing(this.state.topPositionAdd, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.elastic(2),
        }).start();
      }
    }
    this.setState({activeTool: tool});
  }

  closeMenu() {
    Animated.parallel([
      Animated.timing(this.state.rightPosition, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.state.topPosition, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.state.topPositionAdd, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.elastic(1),
      }),
    ]).start();
  }

  shakeMenu() {
    const duration = 100;
    Animated.sequence([
      Animated.timing(this.state.errorPosition, {
        toValue: 7,
        duration: duration,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.state.errorPosition, {
        toValue: 2,
        duration: duration,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.state.errorPosition, {
        toValue: 6,
        duration: duration,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.state.errorPosition, {
        toValue: 5,
        duration: duration,
        easing: Easing.elastic(1),
      }),
    ]).start();
  }

  save() {
    let valid = this.props.saveFeature();
    if (valid) {
      this.closeMenu();
      this.setState({
        open: false,
        activeTool: false,
      });
    } else {
      this.shakeMenu();
    }
  }

  render() {
    let position1 = this.state.rightPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_PADDING],
    });
    let position2 = this.state.rightPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_WIDTH + BUTTON_PADDING*2],
    });
    let position3 = this.state.rightPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_WIDTH*2 + BUTTON_PADDING*3],
    });
    let topPosition1 = this.state.topPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_PADDING],
    });
    let topPositionAdd = this.state.topPositionAdd.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_WIDTH + BUTTON_PADDING*2],
    });
    let degreeRotation = this.state.rightPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });
    return (
      <View style={styles.container} pointerEvents='box-none'>
        <Animated.View style={[styles.featureTypeBtn, this.state.activeTool === 'polygon' && styles.featureTypeBtnActive, {right: position1}]}>
          <TouchableOpacity onPress={() => this.setActiveTool('polygon')} style={styles.clickTarget}>
            <Image source={require('../img/polygonicon.png')} resizeMode={Image.resizeMode.contain} style={styles.featureTypeIcon} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.featureTypeBtn, this.state.activeTool === 'line' && styles.featureTypeBtnActive, {right: position2}]}>
          <TouchableOpacity onPress={() => this.setActiveTool('line')} style={styles.clickTarget}>
            <Image source={require('../img/lineicon.png')} resizeMode={Image.resizeMode.contain} style={styles.featureTypeIcon} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.featureTypeBtn, this.state.activeTool === 'pin' && styles.featureTypeBtnActive, {right:position3}]}>
          <TouchableOpacity onPress={() => this.setActiveTool('pin')} style={styles.clickTarget}>
            <Image source={require('../img/pin.png')} resizeMode={Image.resizeMode.contain} style={styles.featureTypeIcon} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.featureTypeBtn, styles.addFeatureBtn, {right: this.state.errorPosition, bottom: topPosition1}]}>
          <TouchableOpacity onPress={this.save.bind(this)} style={styles.clickTarget}>
            <Image source={require('../img/check.png')} resizeMode={Image.resizeMode.contain} style={styles.featureTypeIcon} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.featureTypeBtn, {right: 5, bottom: topPositionAdd}]}>
          <TouchableOpacity onPress={this.props.addNextPin} style={styles.clickTarget}>
            <Image source={require('../img/plus.png')} resizeMode={Image.resizeMode.contain} style={styles.featureTypeIcon} />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={[styles.createFeature, this.state.open && styles.createFeatureClose]} onPress={this.animateMenu.bind(this)}>
          <Animated.Image source={require('../img/plus.png')} resizeMode={Image.resizeMode.contain} style={[styles.createFeatureText, {transform: [{rotate: degreeRotation}]}]} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 130,
    height: 130,
    backgroundColor: 'transparent',
  },
  createFeature: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Color(palette.lightblue).clearer(0.5).hexString(),
    position: 'absolute',
    bottom: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createFeatureClose: {
    backgroundColor: palette.red,
  },
  createFeatureText: {
    tintColor: 'white',
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
  },
  clickTarget: {
    backgroundColor: 'transparent',
    height: 50,
    width: 50,
    borderRadius: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTypeBtn: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: palette.lightblue,
    position: 'absolute',
    bottom: 5,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTypeBtnActive: {
    backgroundColor: palette.orange,
  },
  featureTypeText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 30,
    backgroundColor: 'transparent',
  },
  featureTypeIcon: {
    height: 25,
    width: 25,
    tintColor: 'white',
  },
  createFeaturePoint: {
    backgroundColor: 'red',
  },
  createFeatureLine: {
    backgroundColor: 'yellow',
  },
  createFeaturePoly: {
    backgroundColor: 'green',
  },
  addFeatureBtn: {
    backgroundColor: palette.green,
  },
});

CreateMenu.PropTypes = {

};

export default CreateMenu;
