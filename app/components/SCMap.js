'use strict';
import React, { Component, PropTypes } from 'react';
import {
  findNodeHandle,
  StyleSheet,
  View,
  Animated
} from 'react-native';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import * as sc from 'spatialconnect/native';
import Rx from 'rx';
import Color from 'color';
import map from '../utils/map';
import palette from '../style/palette';
import CreateMenu from './CreateMenu';
import { isEqual } from 'lodash';
import turfPoint from 'turf-point';
import turfPolygon from 'turf-polygon';
import turfLinestring from 'turf-linestring';

class SCMap extends Component {
  constructor(props) {
    super(props);
    this.features = [];
    this.center = {
      latitude: 37.78825,
      longitude: -95,
    };
    this.state = {
      region:  new MapView.AnimatedRegion({
        ...this.center,
        latitudeDelta: 20,
        longitudeDelta: 70,
      }),
      points: [],
      polygons: [],
      lines: [],
      centerPin: false,
      creatingPins: [],
      addingFeatureType: false,
    };
  }

  addFeatures(features) {
    let points = this.state.points;
    let polygons = this.state.polygons;
    let lines = this.state.lines;
    features
    .filter(f => f.geometry)
    .forEach(feature => {
      switch (feature.geometry.type) {
        case 'Point':
        case 'MultiPoint': {
          let point = map.makeCoordinates(feature).map(c => ({
            latlng: c,
            feature: feature
          }));
          points = points.concat(point);
          break;
        }
        case 'Polygon':
        case 'MultiPolygon': {
          let polygon = map.makeCoordinates(feature).map(c => ({
            coordinates: c,
            feature: feature
          }));
          polygons = polygons.concat(polygon);
          break;
        }
        case 'LineString':
        case 'MultiLineString': {
          let line = map.makeCoordinates(feature).map(c => ({
            coordinates: c,
            feature: feature
          }));
          lines = lines.concat(line);
        }
      }
    });
    this.setState({
      points: points,
      polygons: polygons,
      lines: lines
    });
  }

  addCenterPin() {
    this.setState({
      centerPin: new MapView.AnimatedRegion(this.center)
    });
  }

  cancelCreating() {
    this.setState({
      centerPin: false,
      creatingPins: [],
      addingFeatureType: false,
    });
  }

  addNextPin() {
    this.setState({
      creatingPins: this.state.creatingPins.concat(this.center)
    });
  }

  addFeatureType(type) {
    this.setState({
      addingFeatureType: type,
      addedFeature: false,
    });
    if (type === 'pin') {
      this.setState({
        creatingPins: []
      });
    }
  }

  saveFeature() {
    let addedFeature;
    let geojson;
    let valid = false;
    if (this.state.addingFeatureType === 'polygon') {
      valid = this.state.creatingPins.length >= 3;
      if (valid) {
        addedFeature = this.state.creatingPins.concat(this.state.creatingPins[0]);
        const coords = addedFeature.map(c => ([c.longitude, c.latitude]));
        geojson = turfPolygon([coords], {});
      }
    } else if (this.state.addingFeatureType === 'pin') {
      valid = typeof this.center.latitude === 'number' &&
        typeof this.center.longitude === 'number';
      if (valid) {
        addedFeature = {
          ...this.center
        };
        geojson = turfPoint([addedFeature.longitude, addedFeature.latitude], {});
      }
    } else if (this.state.addingFeatureType === 'line') {
      valid = this.state.creatingPins.length >= 2;
      if (valid) {
        addedFeature = this.state.creatingPins.slice();
        const coords = addedFeature.map(c => ([c.longitude, c.latitude]));
        geojson = turfLinestring(coords, {});
      }
    }
    if (valid) {
      this.setState({
        centerPin: false,
        creatingPins: [],
        addedFeature: addedFeature
      });

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
    if (this.state.centerPin) {
      const { centerPin } = this.state;
      centerPin.timing({
        latitude: region.latitude,
        longitude: region.longitude,
        duration: 1
      }).start();
    }
  }

  onRegionChangeComplete() {
    this.regionChangeComplete$.onNext();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.features, nextProps.features)) {
      this.setState({ points: [], lines: [], polygons: [] }, () => {
        this.addFeatures(nextProps.features);
      });
    }
    if (!isEqual(this.props.activeStores, nextProps.activeStores)) {
      this.props.actions.queryStores(map.regionToBbox(this.region));
    }
  }

  componentDidMount() {
    sc.bindMapView(findNodeHandle(this.refs['scMap']));

    this.regionChangeComplete$ = new Rx.Subject();
    this.regionChangeComplete$
      .throttle(2000)
      .subscribe(() => {
        this.props.actions.queryStores(map.regionToBbox(this.region));
      });
  }

  renderAddedFeature() {
    if (this.state.addedFeature) {
      if (this.state.addingFeatureType === 'polygon') {
        return <MapView.Polygon
          coordinates={this.state.addedFeature}
          key={'addedFeature'}
          strokeColor={palette.lightblue}
          fillColor={Color(palette.lightblue).clearer(0.3).rgbString()}
        />;
      }
      if (this.state.addingFeatureType === 'line') {
        return <MapView.Polyline
          coordinates={this.state.addedFeature}
          key={'addedFeature'}
          strokeColor={palette.lightblue}
        />;
      }
      if (this.state.addingFeatureType === 'pin') {
        return <MapView.Marker
          coordinate={this.state.addedFeature}
          key={'addedFeature'}
          pinColor={palette.lightblue}
        />;
      }
    } else return null;
  }

  render() {
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
            {this.state.points.map(point => (
              <MapView.Marker
                coordinate={point.latlng}
                title={point.title}
                description={point.description}
                key={'point.'+point.feature.id+'.'+idx++}
                onPress={() => {
                  Actions.viewFeature({feature: point.feature});
                }}
                onSelect={() => {
                  Actions.viewFeature({feature: point.feature});
                }}
              />
            ))}
            {this.state.polygons.map(p => (
              <MapView.Polygon
                key={'polygon.'+p.feature.id+'.'+idx++}
                coordinates={p.coordinates}
                fillColor="rgba(255,0,0,0.5)"
                strokeColor="#f00"
                onPress={() => {
                  Actions.viewFeature({feature: p.feature});
                }}
              />
            ))}
            {this.state.lines.map(l => (
              <MapView.Polyline
                key={'line.'+l.feature.id+'.'+idx++}
                coordinates={l.coordinates}
                strokeColor="#f00"
                onPress={() => {
                  Actions.viewFeature({feature: l.feature});
                }}
              />
            ))}
            {this.state.creatingPins.length > 0 &&
              <MapView.Polyline
              coordinates={this.state.creatingPins}
              key={'creatingPins'}
              strokeColor={palette.darkblue}
              />
            }
            {(this.state.creatingPins.length > 0 && this.state.addingFeatureType === 'polygon') &&
              <MapView.Polygon
              coordinates={this.state.creatingPins}
              key={'creatingPinsPoly'}
              strokeColor="rgba(255,0,0,0)"
              fillColor={Color(palette.lightblue).clearer(0.3).rgbString()}
              />
            }
            {this.state.creatingPins.map((point, idx) => (
              <MapView.Marker
                coordinate={point}
                pinColor={palette.lightblue}
                key={'creatingPin.'+idx++}
              />
            ))}
            {!!this.state.centerPin && <MapView.Marker.Animated
              coordinate={this.state.centerPin}
              key={'centerPin'}
              pinColor={'#FF851B'}
            />}
            {/*this.renderAddedFeature()*/}
          </MapView.Animated>
          <View style={styles.createMenu}>
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
  updatedFeature: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
});

export default SCMap;
