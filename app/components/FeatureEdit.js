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
import Color from 'color';
import t from 'tcomb-form-native';
import transform from 'tcomb-json-schema';
import scformschema from 'spatialconnect-form-schema/native';
import { omit, flatten } from 'lodash';
import { Actions } from 'react-native-router-flux';
import * as mapUtils from '../utils/map';
import turfPoint from 'turf-point';

const Form = t.form.Form;

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

  save() {
    const value = this.state.value ? this.refs.form.getValue() : {};
    if (value) {
      Actions.popTo('map');
      InteractionManager.runAfterInteractions(() => {
        const nf = mapUtils.overlayToGeojson(this.props.feature, value, this.state.coordinates);
        this.props.actions.upsertFeature(nf);
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
                pinColor = this.state.editing ? palette.orange : palette.lightblue;
              } else {
                pinColor = palette.red;
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
                fillColor={Color(palette.red).clearer(0.7).rgbString()}
                strokeColor={palette.red}
              /> : null
            }
            {this.state.polyline ?
              <MapView.Polyline
                coordinates={this.state.polyline}
                strokeColor={palette.red}
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
    backgroundColor: palette.lightblue,
  },
  done: {
    backgroundColor: palette.orange,
  },
  doneText: {
    color: 'black',
  },
});

export default FeatureEdit;