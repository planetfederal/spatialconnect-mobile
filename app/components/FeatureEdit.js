import React, { Component, PropTypes } from 'react';
import {
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import Color from 'color';
import t from 'tcomb-form-native';
import transform from 'tcomb-json-schema';
import scformschema from 'spatialconnect-form-schema/native';
import { omit, flatten } from 'lodash';
import turfPoint from 'turf-point';
import { Actions } from 'react-native-router-flux';
import * as mapUtils from '../utils/map';
import palette from '../style/palette';

const Form = t.form.Form;

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

    this.onRegionChange = this.onRegionChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  componentWillMount() {
    const state = {
      ...this.makeOverlaysAndPoints(mapUtils.makeCoordinates(this.props.feature)),
      ...this.makePropertyForm(),
      ...this.makeRegion(),
    };
    this.setState(state);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      Actions.refresh({ onRight: this.save.bind(this) });
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  onChange(value) {
    this.setState({ value });
  }

  onRegionChange(region) {
    if (this.state.editing) {
      // move nearestCoord to center of region
      const newCoordinates = this.state.coordinates.map((c, idx) => {
        if (idx === this.state.nearestCoordIndex) {
          return { latitude: region.latitude, longitude: region.longitude };
        }
        return c;
      });
      this.setState({
        region,
        ...this.makeOverlaysAndPoints(newCoordinates),
      });
    } else if (this.state.panning) {
      this.setState({
        region,
      });
    } else {
      this.setState({
        region,
        nearestCoordIndex: this.findPointIndexNearestCenter(region),
      });
    }
  }

  onReset() {
    const region = mapUtils.findRegion(this.props.feature);
    this.setState({
      ...this.makeOverlaysAndPoints(mapUtils.makeCoordinates(this.props.feature)),
      nearestCoordIndex: this.findPointIndexNearestCenter(region),
      region,
      editing: false,
    });
  }

  onEdit() {
    if (this.state.editing) {
      this.setState({ editing: false });
    } else {
      const nearestCoord = this.state.coordinates[this.state.nearestCoordIndex];
      if (nearestCoord) {
        this.setState({ panning: true });
        this.map.animateToCoordinate({
          latitude: nearestCoord.latitude,
          longitude: nearestCoord.longitude,
        }, 200);
        setTimeout(() => {
          this.setState({
            editing: true,
            panning: false,
          });
        }, 300);
      }
    }
  }

  save() {
    const value = this.state.value ? this.form.getValue() : {};
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

  makeRegion() {
    return { region: mapUtils.findRegion(this.props.feature) };
  }

  makeOverlaysAndPoints(coordinates) {
    const c = flatten(coordinates);
    const newState = { coordinates: c };
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
      const form = {};
      const properties = omit(this.props.feature.properties, 'bbox');
      form.fields = Object.keys(properties).map((key, idx) => (
        {
          id: idx,
          type: properties[key] !== null ? typeof properties[key] : 'string',
          field_key: key,
          field_label: key,
          position: idx,
        }
      ));
      const { schema, options } = scformschema.translate(form);
      return {
        schema,
        options,
        value: properties,
      };
    }
    return {};
  }

  renderForm() {
    return (<Form
      ref={(ref) => { this.form = ref; }}
      value={this.state.value}
      type={transform(this.state.schema)}
      options={this.state.options}
      onChange={this.onChange}
    />);
  }

  renderMap() {
    if (this.state.renderPlaceholderOnly) {
      return <View />;
    }
    return (
      <View>
        <Text style={styles.label}>Geometry</Text>
        <View style={styles.toolBox}>
          <View style={styles.toolBoxItem}>
            <TouchableOpacity onPress={this.onReset}>
              <Text style={styles.toolBoxItemText}>Reset</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.toolBoxItem,
              !this.state.editing && styles.editing,
              this.state.editing && styles.done,
            ]}
          >
            <TouchableOpacity onPress={this.onEdit}>
              <Text style={[styles.toolBoxItemText, this.state.editing && styles.doneText]}>
                {this.state.editing ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            ref={(ref) => { this.map = ref; }}
            style={styles.map}
            onRegionChange={this.onRegionChange}
            region={this.state.region}
          >
            {this.state.coordinates.map((c, idx) => {
              let pinColor;
              if (idx === this.state.nearestCoordIndex) {
                pinColor = this.state.editing ? palette.orange : palette.lightblue;
              } else {
                pinColor = palette.red;
              }
              return (<MapView.Marker
                pinColor={pinColor}
                coordinate={c}
                key={`point_${idx}`}
              />);
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

export default FeatureEdit;
