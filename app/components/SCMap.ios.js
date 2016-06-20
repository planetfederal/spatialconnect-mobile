'use strict';
import React, { Component, PropTypes } from 'react';
import {
  MapView,
  StyleSheet,
  View
} from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import palette from '../style/palette';
import api from '../utils/api';
import * as sc from 'spatialconnect/native';

class SCMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      overlays: [],
      annotations: []
    };
  }

  makeCoordinates(data) {
    let makePoint = c => {
      return { latitude: c[1], longitude: c[0] };
    };
    let makeLine = l => {
      return {
        coordinates: l.map(makePoint),
        strokeColor: '#f007',
        lineWidth: 3
      };
    };
    let makeMKOverlay = (g) => {
      if (g.type === 'Point') {
        return makePoint(g.coordinates);
      } else if (g.type === 'MultiPoint') {
        return g.coordinates.map(makePoint);
      } else if (g.type === 'LineString') {
        return makeLine(g.coordinates);
      } else if (g.type === 'MultiLineString') {
        return g.coordinates.map(makeLine);
      } else if (g.type === 'Polygon') {
        return g.coordinates.map(makeLine);
      } else if (g.type === 'MultiPolygon') {
        return g.coordinates.map((p, i) => {
          return g.coordinates[i].map(makeLine);
        }).reduce(function(prev, curr) {
          return prev.concat(curr);
        });
      } else {
        return [];
      }
    };
    data.coordinates = makeMKOverlay(data.geometry);
    return data;
  }

  addFeature(data) {
    if (data.geometry.type === 'Point' || data.geometry.type === 'MultiPoint') {
      this.setState({
        annotations: this.state.annotations.concat(data.coordinates)
      });
    } else {
      this.setState({
        overlays: this.state.overlays.concat(data.coordinates)
      });
    }
  }

  _onRegionChange(region) {
    this.setState({region: region});
  }

  loadStoreData() {
    this.setState({overlays: [], annotations: []}, () => {
      let region = this.state.region;
      let extent = [
        region.longitude - region.longitudeDelta/2.0,
        region.latitude - region.latitudeDelta/2.0,
        region.longitude + region.longitudeDelta/2.0,
        region.latitude + region.latitudeDelta/2.0
      ];
      var filter = sc.geoBBOXContains(extent);
      sc.geospatialQuery(filter)
      .subscribe(data => {
        console.log(data);
      })
      // .map(this.makeCoordinates)
      // .subscribe(this.addFeature.bind(this));
    });
  }

  loadFormData() {
    this.setState({overlays: [], annotations: []}, () => {
      api.getAllFormData()
        .then(data => {
          data = [].concat.apply([], data)
          this.addFormData(data);
        });
    });
  }

  addFormData(forms) {
    let formAnnotations = forms.filter(data => {
      return (
        data.val.geometry && typeof data.val.geometry.coordinates == 'object'
      );
    }).map(data => {
      let annotation = {
        latitude: data.val.geometry.coordinates[1],
        longitude: data.val.geometry.coordinates[0],
        onFocus: () => {
          Actions.formData({formData: data});
        }
      };
      return annotation;
    });
    this.setState({annotations: formAnnotations});
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          onRegionChange={this._onRegionChange.bind(this)}
          region={{
            latitude: 39.06,
            longitude: -95.22,
          }}
          overlays={this.state.overlays}
          annotations={this.state.annotations}
        />
        <View style={styles.toolBox}>
          {/*<Button style={styles.buttonText} containerStyle={styles.button} onPress={this.loadStoreData.bind(this)}>Load Stores</Button>*/}
          <Button style={styles.buttonText} containerStyle={styles.button} onPress={this.loadFormData.bind(this)}>Load Forms</Button>
        </View>
      </View>
    );
  }
}

SCMap.propTypes = {

};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  map: {
    flex: 1,
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
