'use strict';
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Alert
} from 'react-native';
import should from 'should';
import * as sc from 'spatialconnect/native';

class Passed extends Component {
  render() {
    return (
      <Text style={styles.testResult}>
        <Text style={styles.passed}>{'\u2713'}</Text><Text>{this.props.r.name}</Text>
      </Text>
    );
  }
}

class Failed extends Component {
  render() {
    return (
      <Text style={styles.testResult}>
        <Text style={styles.failed}>{'x ' + this.props.r.name + '\n'}</Text>
        {this.props.r.error ?
          <Text style={styles.errorMessage}>{this.props.r.error.message}</Text> :
          <Text></Text>
        }
      </Text>
    );
  }
}

class SCTest extends Component {
  done(name, passed, error) {
    if (passed) {
      this.props.actions.passed(name);
    } else {
      this.props.actions.failed(name, error);
    }
  }

  it(name, f) {
    this.props.actions.add(name);
    f(this.done.bind(this, name));
  }

  componentWillMount() {
    sc.enableGPS();
    this.it('should get forms',(done) => {
      sc.forms().first().subscribe(data => {
        try {
          data.should.be.a.Object();
          data.forms.should.be.a.Array();
          done(true);
        } catch (e) {
          done(false, e);
        }
      });
    });
    this.it('should get stores',(done) => {
      sc.stores().first().subscribe(data => {
        try {
          (data).should.be.a.Object();
          (data.stores).should.be.a.Array();
          done(true);
        } catch (e) {
          done(false, e);
        }
      });
    });
    this.it('should get a store',(done) => {
      sc.store('DEFAULT_STORE').subscribe(data => {
        try {
          data.should.be.a.Object();
          done(true);
        } catch (e) {
          done(false, e);
        }
      });
    });
    this.it('should get lastKnownLocation',(done) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          position.should.be.a.Object();
          done(true);
        },(error) => {
        done(false,error);
      },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    });
    this.it('should create spatialFeature',(done) => {
      let sf = sc.spatialFeature('DEFAULT_STORE', 'baseball_team', {'team':'foo','why':'bar'});
      sc.createFeature(sf.serialize()).first().subscribe((data) => {
        try {
          data.should.be.a.Object();
          data.id.should.be.a.String();
          done(true);
          this.deleteTest(data);
          this.updateTest(data);
        } catch (e) {
          done(false, e);
        }
      });
    });
    this.it('should create geometry',(done) => {
      let gj = {
        geometry: {type: 'Point',coordinates: [30, -70]},
        properties: {'team':'foo','why':'bar'}
      };
      let g = sc.geometry('DEFAULT_STORE', 'baseball_team', gj);
      sc.createFeature(g.serialize()).first().subscribe((data) => {
        try {
          data.should.be.a.Object();
          data.id.should.be.a.String();
          done(true);
        } catch (e) {
          done(false, e);
        }
      });
    });
  }

  deleteTest(feature) {
    this.it('should delete feature',(done) => {
      sc.deleteFeature(feature.id);
      done(true);
    });
  }

  updateTest(feature) {
    this.it('should update feature',(done) => {
      sc.updateFeature(feature);
      done(true);
    });
  }

  render() {
    let tests = this.props.tests.map((r, i) => {
      return r.passed ? <Passed key={i} r={r} /> : <Failed key={i} r={r} />;
    });
    return (
      <ScrollView style={styles.testContainer}>
        {tests}
      </ScrollView>
    );
  }
}

SCTest.propTypes = {
  actions: PropTypes.object.isRequired,
  tests: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  testContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  testResult: {
    fontSize: 12,
    paddingBottom: 10,
  },
  passed: {
    color: 'green',
  },
  failed: {
    color: 'red',
  },
  errorMessage: {
    paddingLeft: 10,
    fontSize: 10,
  },
});

export default SCTest;
