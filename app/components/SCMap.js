'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import map from '../utils/map';
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


  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.featureSet, nextProps.featureSet)) {
      this.addFeatures(nextProps.featureSet);
    }
    if (!isEqual(this.props.activeStores, nextProps.activeStores)) {
      this.setState({ points: [], lines: [], polygons: [] }, () => {
        this.props.actions.queryStores();
      });
    }
    if (nextProps.updatedFeature && !isEqual(this.props.features, nextProps.features)) {
      this.setState({ points: [], lines: [], polygons: [] }, () => {
        this.addFeatures(nextProps.features);
      });
    }
  }

  componentDidMount() {
    this.props.actions.queryStores();
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
                key={p.feature.id + idx++}
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
                key={l.feature.id + idx++}
                coordinates={l.coordinates}
                strokeColor="#f00"
                onPress={() => {
                  Actions.viewFeature({feature: l.feature});
                }}
              />
            ))}
          </MapView>
        </View>
      </View>
    );
  }
}

SCMap.propTypes = {
  token: PropTypes.string.isRequired,
  activeStores: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  features: PropTypes.array.isRequired,
  featureSet: PropTypes.array.isRequired,
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
  }
});

export default SCMap;
