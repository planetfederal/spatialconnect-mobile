'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import palette from '../style/palette';
import api from '../utils/api';

class SCMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      overlays: [],
      annotations: []
    };
  }

  loadStoreData() {

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
        latlng: {
          latitude: data.val.geometry.coordinates[1],
          longitude: data.val.geometry.coordinates[0]
        },
        title: data.form.name,
        description: data.val.metadata.created_at,
        data: data
      };
      return annotation;
    });
    this.setState({annotations: formAnnotations});
  }

  render() {
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
          {this.state.annotations.map(annotation => (
            <MapView.Marker
              coordinate={annotation.latlng}
              title={annotation.title}
              description={annotation.description}
              key={annotation.data.val.id}
              onCalloutPress={() => {
                Actions.formData({formData: annotation.data});
              }}
            />
          ))}
        </MapView>
        </View>
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
