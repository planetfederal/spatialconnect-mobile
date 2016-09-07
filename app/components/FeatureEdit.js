'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import palette from '../style/palette';
import Button from 'react-native-button';
import MapView from 'react-native-maps';
import t from 'tcomb-form-native';
import transform from 'tcomb-json-schema';
import * as sc from 'spatialconnect/native';
import scformschema from 'spatialconnect-form-schema/native';
import { omit, clone, merge } from 'lodash';
import { Actions } from 'react-native-router-flux';
import { buttonStyles } from '../style/style';

let Form = t.form.Form;

class FeatureEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      coordinate: null,
      region: null,
      dragging: false
    };
  }

  createNewFeature(feature, newProps, newCoordinate) {
    let newFeature = clone(this.props.feature);
    newFeature.properties = merge(newFeature.properties, newProps);
    if (newFeature.geometry) {
      newFeature.geometry.coordinates[0] = newCoordinate.longitude;
      newFeature.geometry.coordinates[1] = newCoordinate.latitude;
    }
    return newFeature;
  }

  save() {
    let value = this.state.value ? this.refs.form.getValue() : {};
    if (value) {
      let newFeature = this.createNewFeature(this.props.feature, value, this.state.coordinate);
      sc.updateFeature(newFeature);
      Actions.pop({refresh: {feature: newFeature}});
    }
  }

  onChange(value) {
    this.setState({value});
  }

  onRegionChange(region) {
    this.setState({
      region: region,
      coordinate: { latitude: region.latitude, longitude: region.longitude}
    });
  }

  onRegionChangeComplete() {
    this.setState({ dragging: false });
  }

  onDragEnd(e) {
    this.setState({ coordinate: e.nativeEvent.coordinate });
  }

  onReset() {
    let c = {
      latitude: this.props.feature.geometry.coordinates[1],
      longitude: this.props.feature.geometry.coordinates[0]
    };
    this.setState({
      coordinate: c,
      region: {
        latitude: c.latitude,
        longitude: c.longitude,
        latitudeDelta: 1,
        longitudeDelta: 1,
      }
    });
  }

  componentWillMount() {
    if (Object.keys(this.props.feature.properties).length) {
      let form = { fields: [] };
      let idx = 0;
      let properties = omit(this.props.feature.properties, 'bbox');
      for (let key in properties) {
        let val = properties[key];
        form.fields.push({
          id: idx,
          type: val !== null ? typeof val : 'string',
          field_key: key,
          field_label :key,
          position: idx
        });
        idx++;
      }
      let { schema, options } = scformschema.translate(form);
      this.setState({
        schema: schema,
        options: options,
        value: properties
      });
    }
    if (this.props.feature.geometry.type === 'Point') {
      let c = {
        latitude: this.props.feature.geometry.coordinates[1],
        longitude: this.props.feature.geometry.coordinates[0]
      };
      this.setState({
        coordinate: c,
        region: {
          latitude: c.latitude,
          longitude: c.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }
      });
    }
  }

  renderForm() {
    return <Form
      ref="form"
      value={this.state.value}
      type={transform(this.state.schema)}
      options={this.state.options}
      onChange={this.onChange.bind(this)} />;
  }

  renderMap() {
    return (
      <View>
        <Text style={styles.label}>Location</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            onRegionChange={this.onRegionChange.bind(this)}
            region={this.state.region}>
              <MapView.Marker
                coordinate={this.state.coordinate}
                key={this.props.feature.id}
                draggable
                onDragEnd={this.onDragEnd.bind(this)}
              />
          </MapView>
          <Text style={styles.reset} onPress={this.onReset.bind(this)}>Reset</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
      {this.state.value ? this.renderForm() : null }
        {this.state.coordinate ? this.renderMap() : null }
        <Button style={buttonStyles.buttonText} containerStyle={buttonStyles.button} onPress={this.save.bind(this)}>Save</Button>
      </ScrollView>
    );
  }
}

FeatureEdit.propTypes = {
  feature: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: palette.gray,
  },
  subheader: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  mapContainer: {
    flex: 1,
    height: 300,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 7,
  },
  reset: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 12,
    textDecorationLine: 'underline',
  }
});

export default FeatureEdit;