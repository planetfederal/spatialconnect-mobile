'use strict';
import React, { Component, PropTypes } from 'react';
import {
  findNodeHandle,
  Image,
  InteractionManager,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import * as sc from 'spatialconnect/native';
import Rx from 'rx';
import Color from 'color';
import * as map from '../utils/map';
import palette from '../style/palette';
import CreateMenu from './CreateMenu';
import { isEqual } from 'lodash';
import turfPoint from 'turf-point';
import turfPolygon from 'turf-polygon';
import turfLinestring from 'turf-linestring';

class SCMap extends Component {
  constructor(props) {
    super(props);
    this.center = {
      latitude: 37.78825,
      longitude: -95,
    };
    this.region = {
      ...this.center,
      latitudeDelta: 20,
      longitudeDelta: 70,
    };
    this.state = {
      region: new MapView.AnimatedRegion(this.region),
      creating: false,
      renderPlaceholderOnly: true,
    };
  }

  addCenterPin() {
    this.setState({ creating: true });
  }

  cancelCreating() {
    this.setState({ creating: false });
    this.props.actions.cancelCreating();
  }

  addNextPin() {
    this.props.actions.addCreatingPoint(this.center);
  }

  addFeatureType(type) {
    this.props.actions.setCreatingType(type);
  }

  saveFeature() {
    let addedFeature;
    let geojson;
    let valid = false;
    if (this.props.creatingType === 'polygon') {
      valid = this.props.creatingPoints.length >= 3;
      if (valid) {
        addedFeature = this.props.creatingPoints.concat(this.props.creatingPoints[0]);
        const coords = addedFeature.map(c => ([c.longitude, c.latitude]));
        geojson = turfPolygon([coords], {});
      }
    } else if (this.props.creatingType === 'pin') {
      valid = typeof this.center.latitude === 'number' &&
        typeof this.center.longitude === 'number';
      if (valid) {
        addedFeature = {
          ...this.center,
        };
        geojson = turfPoint([addedFeature.longitude, addedFeature.latitude], {});
      }
    } else if (this.props.creatingType === 'line') {
      valid = this.props.creatingPoints.length >= 2;
      if (valid) {
        addedFeature = this.props.creatingPoints.slice();
        const coords = addedFeature.map(c => ([c.longitude, c.latitude]));
        geojson = turfLinestring(coords, {});
      }
    }
    if (valid) {
      this.setState({ creating: false });
      this.props.actions.cancelCreating();
      Actions.createFeature({feature: geojson});
    }
    return valid;
  }

  onRegionChange(region) {
    this.center = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    this.region = region;
    this.state.region.setValue(region);
  }

  onRegionChangeComplete() {
    this.regionChangeComplete$.onNext();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.activeStores, nextProps.activeStores)) {
      this.props.actions.queryStores(map.regionToBbox(this.region));
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false }, () => {
        sc.bindMapView(findNodeHandle(this.refs['scMap']));
      });
      this.regionChangeComplete$ = new Rx.Subject();
      this.regionChangeComplete$
        .throttle(2000)
        .subscribe(() => {
          if (!this.state.creating) {
            this.props.actions.queryStores(map.regionToBbox(this.region));
          }
        });
    });
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return <View></View>;
    }
    let idx = 0;
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView.Animated
            ref={'scMap'}
            style={styles.map}
            loadingEnabled={true}
            initialRegion={this.state.region}
            onRegionChange={this.onRegionChange.bind(this)}
            onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}>
            {this.props.overlays.points.map(point => (
              <MapView.Marker
                coordinate={point.latlng}
                title={point.title}
                description={point.description}
                key={'point.'+point.feature.id+'.'+idx++}
                pinColor={palette.red}
                onPress={() => {
                  Actions.viewFeature({feature: point.feature});
                }}
                onSelect={() => {
                  Actions.viewFeature({feature: point.feature});
                }}/>
            ))}
            {this.props.overlays.polygons.map(p => (
              <MapView.Polygon
                key={'polygon.'+p.feature.id+'.'+idx++}
                coordinates={p.coordinates}
                fillColor={Color(palette.red).clearer(0.7).rgbString()}
                strokeColor={palette.red}
                onPress={() => {
                  Actions.viewFeature({feature: p.feature});
                }}
              />
            ))}
            {this.props.overlays.lines.map(l => (
              <MapView.Polyline
                key={'line.'+l.feature.id+'.'+idx++}
                coordinates={l.coordinates}
                strokeColor={palette.red}
                onPress={() => {
                  Actions.viewFeature({feature: l.feature});
                }}
              />
            ))}
            {this.props.creatingPoints.length > 0 &&
              <MapView.Polyline
              coordinates={this.props.creatingPoints}
              key={'creatingPoints'}
              strokeColor={palette.orange}
              />
            }
            {(this.props.creatingPoints.length > 0 && this.props.creatingType === 'polygon') &&
              <MapView.Polygon
              coordinates={this.props.creatingPoints}
              key={'creatingPoly'}
              strokeColor="rgba(255,0,0,0)"
              fillColor={Color(palette.orange).clearer(0.7).rgbString()}
              />
            }
            {this.props.creatingPoints.map((point, idx) => (
              <MapView.Marker
                coordinate={point}
                pinColor={palette.orange}
                key={'creatingPin.'+idx++}/>
            ))}
          </MapView.Animated>
          {this.state.creating &&
            <View style={styles.center}>
              <Image style={styles.crosshair} source={require('../img/crosshair.png')} resizeMode={Image.resizeMode.contain} />
            </View>
          }
          <View style={styles.createMenu} pointerEvents='box-none'>
            <CreateMenu
              addFeatureType={this.addFeatureType.bind(this)}
              addCenterPin={this.addCenterPin.bind(this)}
              addNextPin={this.addNextPin.bind(this)}
              cancelCreating={this.cancelCreating.bind(this)}
              saveFeature={this.saveFeature.bind(this)} />
          </View>
        </View>
      </View>
    );
  }
}

SCMap.propTypes = {
  activeStores: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  features: PropTypes.array.isRequired,
  overlays: PropTypes.object.isRequired,
  creatingType: PropTypes.string,
  creatingPoints: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  toolBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
  },
  changeButton: {
    alignSelf: 'flex-start',
    marginTop: 5,
    padding: 3,
    borderWidth: 0.5,
    borderColor: '#777777',
  },
  createMenu: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  center: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshair: {
    width: 50,
    height: 50,
    tintColor: Color(palette.orange).clearer(0.3).rgbString(),
  },
});

export default SCMap;
