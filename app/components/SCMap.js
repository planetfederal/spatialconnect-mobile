import React, { Component, PropTypes } from 'react';
import { findNodeHandle, Image, InteractionManager, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import * as sc from 'react-native-spatialconnect';
import Rx from 'rx';
import Color from 'color';
import { isEqual, find } from 'lodash';
import turfPoint from 'turf-point';
import turfPolygon from 'turf-polygon';
import turfLinestring from 'turf-linestring';
import * as mapUtils from '../utils/map';
import palette from '../style/palette';
import CreateMenu from './CreateMenu';
import PlaceHolder from './PlaceHolder';

const crosshairIcon = require('../img/crosshair.png');

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
    tintColor: Color(palette.orange).fade(0.3).rgb().string(),
  },
});

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

    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.addFeatureType = this.addFeatureType.bind(this);
    this.addCenterPin = this.addCenterPin.bind(this);
    this.addNextPin = this.addNextPin.bind(this);
    this.cancelCreating = this.cancelCreating.bind(this);
    this.saveFeature = this.saveFeature.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false }, () => {
        sc.bindMapView(findNodeHandle(this.scMap), error => {
          if (!error) {
            sc.addRasterLayers(this.props.activeStores);
          }
        });
      });
      this.regionChangeComplete$ = new Rx.Subject();
      this.regionChangeComplete$.throttle(2000).subscribe(() => {
        if (!this.state.creating) {
          this.props.actions.queryStores(mapUtils.regionToBbox(this.region));
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.activeStores, nextProps.activeStores)) {
      sc.addRasterLayers(nextProps.activeStores);
      this.props.actions.queryStores(mapUtils.regionToBbox(this.region));
    }
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
        const coords = addedFeature.map(c => [c.longitude, c.latitude]);
        geojson = turfPolygon([coords], {});
      }
    } else if (this.props.creatingType === 'pin') {
      valid = typeof this.center.latitude === 'number' && typeof this.center.longitude === 'number';
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
        const coords = addedFeature.map(c => [c.longitude, c.latitude]);
        geojson = turfLinestring(coords, {});
      }
    }
    if (valid) {
      this.setState({ creating: false });
      this.props.actions.cancelCreating();
      this.props.navigation.navigate('createFeature', {
        stores: this.props.stores,
        feature: geojson,
        actions: this.props.actions,
      });
    }
    return valid;
  }

  getStyle(overlay) {
    const store = find(this.props.stores, { storeId: overlay.feature.metadata.storeId });
    if (store && store.style) {
      return store.style;
    }
    return {
      fillColor: '#ff0000',
      fillOpacity: '0.5',
      strokeColor: '#ff0000',
      strokeOpacity: '1',
      strokeWidth: '3',
    };
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return <PlaceHolder />;
    }
    let idx = 0;
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView.Animated
            ref={ref => {
              this.scMap = ref;
            }}
            style={styles.map}
            loadingEnabled
            initialRegion={this.state.region}
            onRegionChange={this.onRegionChange}
            onRegionChangeComplete={this.onRegionChangeComplete}
          >
            {this.props.overlays.points.map(point => {
              const style = mapUtils.getStyle(this.props.stores, point.feature);
              return (
                <MapView.Marker
                  coordinate={point.latlng}
                  title={point.title}
                  description={point.description}
                  key={`point.${point.feature.id}.${(idx += 1)}`}
                  pinColor={style.iconColor}
                  onPress={() => {
                    this.props.navigation.navigate('viewFeature', {
                      stores: this.props.stores,
                      feature: point.feature,
                    });
                  }}
                />
              );
            })}
            {this.props.overlays.polygons.map(p => {
              const style = mapUtils.getStyle(this.props.stores, p.feature);
              return (
                <MapView.Polygon
                  key={`polygon.${p.feature.id}.${(idx += 1)}`}
                  coordinates={p.coordinates}
                  fillColor={Color(style.fillColor).fade(1 - +style.fillOpacity).rgb().string()}
                  strokeColor={Color(style.strokeColor)
                    .fade(1 - +style.strokeOpacity)
                    .rgb()
                    .string()}
                  strokeWidth={+style.strokeWidth}
                  onPress={() => {
                    this.props.navigation.navigate('viewFeature', {
                      stores: this.props.stores,
                      feature: p.feature,
                    });
                  }}
                />
              );
            })}
            {this.props.overlays.lines.map(l => {
              const style = mapUtils.getStyle(this.props.stores, l.feature);
              return (
                <MapView.Polyline
                  key={`line.${l.feature.id}.${(idx += 1)}`}
                  coordinates={l.coordinates}
                  strokeColor={Color(style.strokeColor)
                    .fade(1 - +style.strokeOpacity)
                    .rgb()
                    .string()}
                  strokeWidth={+style.strokeWidth}
                  onPress={() => {
                    this.props.navigation.navigate('viewFeature', {
                      stores: this.props.stores,
                      feature: l.feature,
                    });
                  }}
                />
              );
            })}
            {this.props.creatingPoints.length > 0 &&
              <MapView.Polyline
                coordinates={this.props.creatingPoints}
                key={'creatingPoints'}
                strokeColor={palette.orange}
              />}
            {this.props.creatingPoints.length > 0 &&
              this.props.creatingType === 'polygon' &&
              <MapView.Polygon
                coordinates={this.props.creatingPoints}
                key={'creatingPoly'}
                strokeColor="rgba(255,0,0,0)"
                fillColor={Color(palette.orange).fade(0.7).rgb().string()}
              />}
            {this.props.creatingPoints.map(point =>
              <MapView.Marker
                coordinate={point}
                pinColor={palette.orange}
                key={`creatingPin.${(idx += 1)}`}
              />
            )}
          </MapView.Animated>
          {this.state.creating &&
            <View style={styles.center}>
              <Image
                style={styles.crosshair}
                source={crosshairIcon}
                resizeMode={Image.resizeMode.contain}
              />
            </View>}
          <View style={styles.createMenu} pointerEvents="box-none">
            <CreateMenu
              addFeatureType={this.addFeatureType}
              addCenterPin={this.addCenterPin}
              addNextPin={this.addNextPin}
              cancelCreating={this.cancelCreating}
              saveFeature={this.saveFeature}
            />
          </View>
        </View>
      </View>
    );
  }
}

SCMap.propTypes = {
  stores: PropTypes.array.isRequired,
  activeStores: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  overlays: PropTypes.object.isRequired,
  creatingType: PropTypes.string,
  creatingPoints: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default SCMap;
