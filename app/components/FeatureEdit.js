/*global console,setTimeout*/
'use strict';
import React, { Component, PropTypes } from 'react';
import {
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import palette from '../style/palette';
import MapView from 'react-native-maps';
import t from 'tcomb-form-native';
import transform from 'tcomb-json-schema';
import * as sc from 'spatialconnect/native';
import scformschema from 'spatialconnect-form-schema/native';
import { omit, flatten, merge } from 'lodash';
import { Actions } from 'react-native-router-flux';
import * as mapUtils from '../utils/map';
import turfPoint from 'turf-point';
import turfPolygon from 'turf-polygon';
import turfLinestring from 'turf-linestring';

const Form = t.form.Form;
const PIN_COLOR_DEFAULT = '#FF4136';
const PIN_COLOR_SELECTING = '#0074D9';
const PIN_COLOR_SELECTED = '#FF851B';

class FeatureEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      coordinates: null,
      region: null,
      panning: false,
      editing: false,
      renderPlaceholderOnly: true,
    };
  }

  //creates a geojson object from props and list of coordinates
  createNewFeature(feature, newProps, newCoordinates) {
    const props = JSON.parse(JSON.stringify(newProps, (k, v) => v == null ? '' : v));
    const coords = newCoordinates.map(c => ([c.longitude, c.latitude]));
    let newFeature;
    if (feature.geometry && feature.geometry.type === 'Point') {
      newFeature = turfPoint(coords[0], props);
    }
    if (feature.geometry && feature.geometry.type === 'Polygon') {
      newFeature = turfPolygon([coords], props);
    }
    if (feature.geometry && feature.geometry.type === 'LineString') {
      newFeature = turfLinestring(coords, props);
    }
    return merge({}, this.props.feature, newFeature);
  }

  save() {
    const value = this.state.value ? this.refs.form.getValue() : {};
    if (value) {
      const newFeature = this.createNewFeature(this.props.feature, value, this.state.coordinates);
      Actions.popTo('map');
      InteractionManager.runAfterInteractions(() => {
        sc.updateFeature(newFeature);
        this.props.actions.updateFeature(newFeature);
      });
    }
  }

  findPointIndexNearestCenter(region) {
    const center = turfPoint([region.longitude, region.latitude]);
    const points = this.state.coordinates.map(c => ([c.longitude, c.latitude]));
    return mapUtils.findPointIndexNearestCenter(center, points);
  }

  onChange(value) {
    this.setState({value});
  }

  onRegionChange(region) {
    if (this.state.editing) {
      //move nearestCoord to center of region
      const newCoordinates = this.state.coordinates.map((c, idx) => {
        return (idx === this.state.nearestCoordIndex) ?
          {latitude: region.latitude, longitude: region.longitude} : c;
      });
      this.setState({
        region: region,
        ...this.makeOverlaysAndPoints(newCoordinates),
      });
    } else {
      if (this.state.panning) {
        this.setState({
          region: region,
        });
      } else {
        this.setState({
          region: region,
          nearestCoordIndex: this.findPointIndexNearestCenter(region),
        });
      }
    }
  }

  onReset() {
    let region = mapUtils.findRegion(this.props.feature);
    this.setState({
      ...this.makeOverlaysAndPoints(mapUtils.makeCoordinates(this.props.feature)),
      nearestCoordIndex: this.findPointIndexNearestCenter(region),
      region: region,
      editing: false,
    });
  }

  onEdit() {
    if (this.state.editing) {
      this.setState({ editing: false });
    } else {
      const nearestCoord = this.state.coordinates[this.state.nearestCoordIndex];
      if (nearestCoord) {
        this.setState({panning: true});
        this.map.animateToCoordinate({
          latitude: nearestCoord.latitude,
          longitude: nearestCoord.longitude,
        }, 200);
        setTimeout(() => {
          this.setState({
            editing:true,
            panning: false,
          });
        }, 300);
      }
    }
  }

  makeOverlaysAndPoints(coordinates) {
    const c = flatten(coordinates);
    let newState = { coordinates: c };
    if (this.props.feature.geometry.type === 'Polygon') {
      newState.polygon = c;
    }
    if (this.props.feature.geometry.type === 'LineString') {
      newState.polyline = c;
    }
    return newState;
  }

  makePropertyForm() {
    if (Object.keys(this.props.feature.properties).length) {
      let form = { fields: [] };
      let idx = 0;
      const properties = omit(this.props.feature.properties, 'bbox');
      for (const key in properties) {
        const val = properties[key];
        form.fields.push({
          id: idx,
          type: val !== null ? typeof val : 'string',
          field_key: key,
          field_label :key,
          position: idx++,
        });
      }
      const { schema, options } = scformschema.translate(form);
      return {
        schema: schema,
        options: options,
        value: properties,
      };
    } else return {};
  }

  makeRegion() {
    return { region: mapUtils.findRegion(this.props.feature) };
  }

  componentWillMount() {
    let state = {
      ...this.makeOverlaysAndPoints(mapUtils.makeCoordinates(this.props.feature)),
      ...this.makePropertyForm(),
      ...this.makeRegion(),
    };
    this.setState(state);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      Actions.refresh({onRight: this.save.bind(this)});
      this.setState({ renderPlaceholderOnly: false });
    });
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
    if (this.state.renderPlaceholderOnly) {
      return <View></View>;
    }
    return (
      <View>
        <Text style={styles.label}>Geometry</Text>
        <View style={styles.toolBox}>
          <View style={styles.toolBoxItem}>
            <TouchableOpacity onPress={this.onReset.bind(this)}>
              <Text style={styles.toolBoxItemText}>Reset</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.toolBoxItem, !this.state.editing && styles.editing, this.state.editing && styles.done]}>
            <TouchableOpacity onPress={this.onEdit.bind(this)}>
              <Text style={[styles.toolBoxItemText, this.state.editing && styles.doneText]}>{this.state.editing ? 'Done' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            ref={ref => { this.map = ref; }}
            style={styles.map}
            onRegionChange={this.onRegionChange.bind(this)}
            region={this.state.region}>
            {this.state.coordinates.map((c, idx) => {
              let pinColor;
              if (idx === this.state.nearestCoordIndex) {
                pinColor = this.state.editing ? PIN_COLOR_SELECTED : PIN_COLOR_SELECTING;
              } else {
                pinColor = PIN_COLOR_DEFAULT;
              }
              return <MapView.Marker
                pinColor={pinColor}
                coordinate={c}
                key={'point_'+idx}
              />;
            })}
            {this.state.polygon ?
              <MapView.Polygon
                coordinates={this.state.polygon}
                fillColor="rgba(255,0,0,0.5)"
                strokeColor={PIN_COLOR_DEFAULT}
              /> : null
            }
            {this.state.polyline ?
              <MapView.Polyline
                coordinates={this.state.polyline}
                strokeColor="#f00"
              /> : null
            }
          </MapView>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.state.value ? this.renderForm() : null }
        {this.state.coordinates ? this.renderMap() : null }
      </ScrollView>
    );
  }
}

FeatureEdit.propTypes = {
  feature: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
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
  toolBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 5,
    flexDirection: 'row-reverse',
  },
  toolBoxItem: {
    marginLeft: 5,
    padding: 8,
    borderRadius: 3,
    backgroundColor: 'black',
  },
  toolBoxItemText: {
    color: 'white',
    fontSize: 14,
  },
  editing: {
    backgroundColor: PIN_COLOR_SELECTING,
  },
  done: {
    backgroundColor: PIN_COLOR_SELECTED,
  },
  doneText: {
    color: 'black',
  },
});

export default FeatureEdit;