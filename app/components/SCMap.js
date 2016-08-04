'use strict';
import React, { Component, PropTypes } from 'react';
import {
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
import inside from '@turf/inside';
import pointOnLine from '@turf/point-on-line';
import distance from '@turf/distance';

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

  addFeature(feature) {
    this.features = this.features.concat(feature);
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
      var filter = sc.filter.geoBBOXContains([-180, -90, 180, 90])
                            .limit(2);
      sc.geospatialQuery$(filter)
        .map(action => action.payload)
        .flatMap(f => {
          console.log(f);
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
      Rx.Observable.fromPromise(api.getAllFormData(this.props.token))
        .map(flatten)
        .flatMap(Rx.Observable.fromArray)
        .map(f => f.val)
        .filter(f => f.geometry)
        .subscribe(this.addFeature.bind(this));
    });
  }

  onMapPress(e) {
    let c = e.nativeEvent.coordinate;
    var point = {
      type: 'Feature',
      id: Math.random(),
      geometry: {
        type: 'Point',
        coordinates: [c.longitude, c.latitude]
      },
      properties: {}
    };
    let intersectedFeatures = this.features.filter(f => {
      if (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') {
        return inside(point, f);
      }
      if (f.geometry.type === 'LineString') {
        let nearest = pointOnLine(f, point);
        let km = distance(nearest, point);
        // nearest.id = Math.random();
        // let n = map.makeCoordinates(nearest).map(c => ({
        //   latlng: c,
        //   title: 'nearest',
        //   feature: nearest
        // }));
        // let x = map.makeCoordinates(point).map(c => ({
        //   latlng: c,
        //   title: 'point',
        //   feature: point
        // }));
        // this.setState({ points: this.state.points.concat([n[0], x[0]]) });
        //console.log(f, f.geometry.coordinates, point.geometry.coordinates, nearest.geometry.coordinates, km);
        return km < 0.1;
      }
      return false;
    });
    console.log(intersectedFeatures);
    // if (intersectedFeatures.length) {
    //   Actions.viewFeature({feature: intersectedFeatures[0]});
    // }
  }

  render() {
    let idx = 0;
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
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
  token: PropTypes.string.isRequired
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
