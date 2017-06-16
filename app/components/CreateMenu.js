import React, { Component, PropTypes } from 'react';
import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Color from 'color';
import palette from '../style/palette';

const MAIN_BUTTON_WIDTH = 50;
const BUTTON_WIDTH = 40;
const BUTTON_PADDING = 10;
const ANIMATION_DURATION = 400;

const polygonIcon = require('../img/polygonicon.png');
const lineIcon = require('../img/lineicon.png');
const pointIcon = require('../img/pin.png');
const checkIcon = require('../img/check.png');
const plusIcon = require('../img/plus.png');

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 200,
    backgroundColor: 'transparent',
  },
  createFeature: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Color(palette.lightblue).fade(0.8).rgb().string(),
    position: 'absolute',
    bottom: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.9,
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

const CreateMenuIcon = props =>
  <Animated.View style={props.style}>
    <TouchableOpacity onPress={props.onPress} style={styles.clickTarget}>
      <Image
        source={props.icon}
        resizeMode={Image.resizeMode.contain}
        style={styles.featureTypeIcon}
      />
    </TouchableOpacity>
  </Animated.View>;

CreateMenuIcon.propTypes = {
  icon: Image.propTypes.source,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.array.isRequired,
};

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

    this.save = this.save.bind(this);
    this.animateMenu = this.animateMenu.bind(this);
  }

  setActiveTool(tool) {
    this.props.addFeatureType(tool);
    if (this.state.activeTool) {
      // close
      Animated.sequence([
        Animated.parallel([
          Animated.timing(this.state.topPosition, {
            toValue: 0,
            duration: ANIMATION_DURATION / 2,
            easing: Easing.elastic(1),
          }),
          Animated.timing(this.state.topPositionAdd, {
            toValue: 0,
            duration: ANIMATION_DURATION / 2,
            easing: Easing.elastic(1),
          }),
        ]),
        Animated.parallel([
          Animated.timing(this.state.topPosition, {
            toValue: 1,
            duration: ANIMATION_DURATION / 2,
            easing: Easing.elastic(1),
          }),
          Animated.timing(this.state.topPositionAdd, {
            toValue: tool === 'pin' ? 0 : 1,
            duration: ANIMATION_DURATION / 2,
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
    this.setState({ activeTool: tool });
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
        duration,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.state.errorPosition, {
        toValue: 2,
        duration,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.state.errorPosition, {
        toValue: 6,
        duration,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.state.errorPosition, {
        toValue: 5,
        duration,
        easing: Easing.elastic(1),
      }),
    ]).start();
  }

  save() {
    const valid = this.props.saveFeature();
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
    const position1 = this.state.rightPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_PADDING],
    });
    const position2 = this.state.rightPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_WIDTH + BUTTON_PADDING * 2],
    });
    const position3 = this.state.rightPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_WIDTH * 2 + BUTTON_PADDING * 3],
    });
    const topPosition1 = this.state.topPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_PADDING],
    });
    const topPositionAdd = this.state.topPositionAdd.interpolate({
      inputRange: [0, 1],
      outputRange: [5, MAIN_BUTTON_WIDTH + BUTTON_WIDTH + BUTTON_PADDING * 2],
    });
    const degreeRotation = this.state.rightPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });
    const polyStyle = [
      styles.featureTypeBtn,
      this.state.activeTool === 'polygon' && styles.featureTypeBtnActive,
      { right: position1 },
    ];
    const lineStyle = [
      styles.featureTypeBtn,
      this.state.activeTool === 'line' && styles.featureTypeBtnActive,
      { right: position2 },
    ];
    const pointStyle = [
      styles.featureTypeBtn,
      this.state.activeTool === 'pin' && styles.featureTypeBtnActive,
      { right: position3 },
    ];
    const saveStyle = [
      styles.featureTypeBtn,
      styles.addFeatureBtn,
      { right: this.state.errorPosition, bottom: topPosition1 },
    ];
    const addStyle = [styles.featureTypeBtn, { right: 5, bottom: topPositionAdd }];
    const toggleStyle = [styles.createFeature, this.state.open && styles.createFeatureClose];
    const toggleImgStyle = [styles.createFeatureText, { transform: [{ rotate: degreeRotation }] }];
    return (
      <View style={styles.container} pointerEvents="box-none">
        <CreateMenuIcon
          style={polyStyle}
          onPress={() => this.setActiveTool('polygon')}
          icon={polygonIcon}
        />
        <CreateMenuIcon
          style={lineStyle}
          onPress={() => this.setActiveTool('line')}
          icon={lineIcon}
        />
        <CreateMenuIcon
          style={pointStyle}
          onPress={() => this.setActiveTool('pin')}
          icon={pointIcon}
        />
        <CreateMenuIcon style={saveStyle} onPress={this.save} icon={checkIcon} />
        <CreateMenuIcon style={addStyle} onPress={this.props.addNextPin} icon={plusIcon} />
        <TouchableOpacity style={toggleStyle} onPress={this.animateMenu}>
          <Animated.Image
            source={plusIcon}
            resizeMode={Image.resizeMode.contain}
            style={toggleImgStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

CreateMenu.propTypes = {
  cancelCreating: PropTypes.func.isRequired,
  addFeatureType: PropTypes.func.isRequired,
  saveFeature: PropTypes.func.isRequired,
  addCenterPin: PropTypes.func.isRequired,
  addNextPin: PropTypes.func.isRequired,
};

export default CreateMenu;
