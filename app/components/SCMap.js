'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import Rx from 'rx';
import { flatten } from 'lodash';
import palette from '../style/palette';
import api from '../utils/api';
import map from '../utils/map';
import * as sc from 'spatialconnect/native';

class SCMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      points: [],
      polygons: [],
      lines: []
    };
  }

  addFeature(feature) {
    switch (feature.geometry.type) {
      case 'Point':
      case 'MultiPoint': {
        let points = map.makeCoordinates(feature).map(c => ({
          latlng: c,
          title: feature.id,
          feature: feature
        }));
        this.setState({ points: this.state.points.concat(points) });
        break;
      }
      case 'Polygon':
      case 'MultiPolygon': {
        let polygons = map.makeCoordinates(feature).map(c => ({
          coordinates: c,
          feature: feature
        }));
        this.setState({ polygons: this.state.polygons.concat(polygons) });
        break;
      }
      case 'LineString':
      case 'MultiLineString': {
        let lines = map.makeCoordinates(feature).map(c => ({
          coordinates: c,
          feature: feature
        }));
        this.setState({ lines: this.state.lines.concat(lines) });
      }
    }
  }

  loadStoreData() {
    this.setState({ points: [], lines: [], polygons: [] }, () => {
      var filter = {
        filter: {},
        limit: 10,
      };
      sc.geospatialQuery(filter)
        .flatMap(f => {
          return f.type === 'FeatureCollection' ?
            Rx.Observable.from(f.features) :
            Rx.Observable.from([f]);
        })
        .filter(f => f.geometry)
        .subscribe(this.addFeature.bind(this));
    });
  }

  loadFormData() {
    this.setState({ points: [], lines: [], polygons: [] }, () => {
      Rx.Observable.fromPromise(api.getAllFormData())
        .map(flatten)
        .flatMap(arr => Rx.Observable.from(arr))
        .map(f => f.val)
        .filter(f => f.geometry)
        .subscribe(this.addFeature.bind(this));
    });
  }

  render() {
    let idx = 0;
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -95,
            latitudeDelta: 20,
            longitudeDelta: 70,
          }}>
          {this.state.points.map(point => (
            <MapView.Marker
              coordinate={point.latlng}
              title={point.title}
              description={point.description}
              key={point.feature.id + idx++}
              onSelect={() => {
                Actions.feature({feature: point.feature});
              }}
              onCalloutPress={() => {
                Actions.feature({feature: point.feature});
              }}
            />
          ))}
          {this.state.polygons.map(p => (
            <MapView.Polygon
              key={p.feature.id + idx++}
              coordinates={p.coordinates}
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
          <Button style={styles.buttonText} containerStyle={styles.button} onPress={this.loadStoreData.bind(this)}>Load Stores</Button>
          <Button style={styles.buttonText} containerStyle={styles.button} onPress={this.loadFormData.bind(this)}>Load Forms</Button>
        </View>
      </View>
    );
  }
}

SCMap.propTypes = {

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
    justifyContent: 'center',
    height: 50,
  },
  changeButton: {
    alignSelf: 'flex-start',
    marginTop: 5,
    padding: 3,
    borderWidth: 0.5,
    borderColor: '#777777',
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 30,
    backgroundColor: palette.darkblue,
    borderColor: palette.darkblue,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    padding: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

export default SCMap;
