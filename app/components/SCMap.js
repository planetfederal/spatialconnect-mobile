'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import Rx from 'rx';
import { flatten } from 'lodash';
import { buttonStyles } from '../style/style';
import api from '../utils/api';
import map from '../utils/map';
import * as sc from 'spatialconnect/native';
import { isEqual } from 'lodash';

class SCMap extends Component {
  constructor(props) {
    super(props);
    this.features = [];
    this.state = {
      region: null,
      points: [],
      polygons: [],
      lines: [],
      features: []
    };
  }

  addFeatures(features) {
    let points = [];
    let polygons = [];
    let lines = [];
    features
    .filter(f => f.geometry)
    .forEach(feature => {
      switch (feature.geometry.type) {
        case 'Point':
        case 'MultiPoint': {
          let point = map.makeCoordinates(feature).map(c => ({
            latlng: c,
            title: feature.id,
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
      lines: lines,
      features: features
    });
  }

  loadStoreData() {
    this.setState({ points: [], lines: [], polygons: [] }, () => {
      var filter = sc.filter.geoBBOXContains([-180, -90, 180, 90]).limit(20);
      sc.geospatialQuery$(filter, this.props.activeStores)
        .map(action => action.payload)
        .subscribe(this.addFeatures.bind(this));
    });
  }

  loadFormData() {
    this.setState({ points: [], lines: [], polygons: [] }, () => {
      Rx.Observable.fromPromise(api.getAllFormData(this.props.token))
        .map(flatten)
        .flatMap(Rx.Observable.fromArray)
        .map(f => f.val)
        .filter(f => f.geometry)
        .subscribe(this.addFeatures.bind(this));
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.activeStores, nextProps.activeStores)) {
      this.loadStoreData();
    }
  }

  render() {
    let idx = 0;
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          mapType={Platform.OS === 'ios' ? 'standard' : 'none'}
          initialRegion={{
            latitude: 37.78825,
            longitude: -95,
            latitudeDelta: 20,
            longitudeDelta: 70,
          }}>
          <MapView.UrlTile
               urlTemplate="http://a.tile.osm.org/{z}/{x}/{y}.png"
               zIndex={-1}
              />
          {this.state.points.map(point => (
            <MapView.Marker
              coordinate={point.latlng}
              title={point.title}
              description={point.description}
              key={point.feature.id + idx++}
              onSelect={() => {
                Actions.viewFeature({feature: point.feature});
              }}
              onCalloutPress={() => {
                Actions.viewFeature({feature: point.feature});
              }}
            />
          ))}
          {this.state.polygons.map(p => (
            <MapView.Polygon
              key={p.feature.id + idx++}
              coordinates={p.coordinates}
              fillColor="rgba(255,0,0,0.5)"
              strokeColor="#f00"
            />
          ))}
          {this.state.lines.map(l => (
            <MapView.Polyline
              key={l.feature.id + idx++}
              coordinates={l.coordinates}
              strokeColor="#f00"
            />
          ))}
        </MapView>
        </View>
        <View style={styles.toolBox}>
          <Button style={buttonStyles.buttonText} containerStyle={buttonStyles.button} onPress={this.loadStoreData.bind(this)}>Load Stores</Button>
          <Button style={buttonStyles.buttonText} containerStyle={buttonStyles.button} onPress={this.loadFormData.bind(this)}>Load Forms</Button>
        </View>
      </View>
    );
  }
}

SCMap.propTypes = {
  token: PropTypes.string.isRequired,
  activeStores: PropTypes.array.isRequired
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
  }
});

export default SCMap;
