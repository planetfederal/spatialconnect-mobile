import React, {
  Component,
  MapView,
  PropTypes,
  StyleSheet,
  Text,
  View
} from 'react-native';
import api from '../utils/api';
import palette from '../style/palette';
import FormData from './FormData';
import sc from 'spatialconnect/native';

class SCMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      overlays: [],
      annotations: []
    };
  }
  componentDidMount() {
    sc.stream.spatialQuery
      .map(this.makeCoordinates)
      .subscribe(this.addFeature.bind(this));
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
      var f = sc.Filter().geoBBOXContains(extent);
      sc.action.geospatialQuery(f);
    });
  }

  loadFormData() {
    this.setState({overlays: [], annotations: []}, () => {
      api.getFormData()
        .then(data => {
          this.addFormData(data);
        });
    });
  }

  addFormData(forms) {
    let formAnnotations = forms.filter(data => {
      return (
        data.location !== null &&
        typeof data.location !== 'undefined' &&
        typeof data.location.lat === 'number' &&
        typeof data.location.lon === 'number'
      );
    }).map(data => {
      let annotation = {
        latitude: data.location.lat,
        longitude: data.location.lon,
        onFocus: () => {
          this.props.navigator.push({
            title: 'Form Data',
            component: FormData,
            passProps: { form: data }
          });
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
          <View style={styles.button}>
            <Text style={styles.buttonText} onPress={this.loadStoreData.bind(this)}>
              {'Load Stores'}
            </Text>
          </View>
          <View style={styles.button}>
            <Text style={styles.buttonText} onPress={this.loadFormData.bind(this)}>
              {'Load Forms'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

SCMap.propTypes = {
  navigator: PropTypes.object.isRequired
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
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: palette.gray,
    height: 50,
    marginBottom: 110
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
