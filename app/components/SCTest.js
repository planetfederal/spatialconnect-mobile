import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import should from 'should';
import * as sc from 'spatialconnect/native';

const properties = { team: 'foo', why: 'bar' };

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

const Passed = props => (
  <Text style={styles.testResult}>
    <Text style={styles.passed}>{'\u2713'}</Text><Text>{props.r.name}</Text>
  </Text>
);

Passed.propTypes = {
  r: PropTypes.object.isRequired,
};

const Failed = props => (
  <Text style={styles.testResult}>
    <Text style={styles.failed}>{`x ${props.r.name}\n`}</Text>
    {props.r.error ?
      <Text style={styles.errorMessage}>{props.r.error.message}</Text> :
      <Text />
    }
  </Text>
);

Failed.propTypes = {
  r: PropTypes.object.isRequired,
};

class SCTest extends Component {

  componentWillMount() {
    this.it('should get forms', (done) => {
      sc.forms$()
      .map(action => action.payload)
      .subscribe((data) => {
        try {
          data.should.be.a.Object();
          data.forms.should.be.a.Array();
          done(true);
        } catch (e) {
          done(false, e);
        }
      });
    });
    this.it('should get stores', (done) => {
      sc.stores$()
      .map(action => action.payload)
      .subscribe((data) => {
        try {
          (data).should.be.a.Object();
          (data.stores).should.be.a.Array();
          done(true);
        } catch (e) {
          done(false, e);
        }
      });
    });
    this.it('should get a store', (done) => {
      sc.store$('DEFAULT_STORE')
      .map(action => action.payload)
      .subscribe((data) => {
        try {
          data.should.be.a.Object();
          done(true);
        } catch (e) {
          done(false, e);
        }
      });
    });
    this.it('should get lastKnownLocation', (done) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          position.should.be.a.Object();
          done(true);
        }, (error) => {
        done(false, error);
      },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    });
  }

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

  deleteTest(feature) {
    this.it('should delete feature', (done) => {
      sc.deleteFeature(feature.id);
      done(true);
    });
  }

  updateTest(feature) {
    this.it('should update feature', (done) => {
      sc.updateFeature(feature);
      done(true);
    });
  }

  render() {
    const tests = this.props.tests.map((r, i) => {
      if (r.passed) return <Passed key={i} r={r} />;
      return <Failed key={i} r={r} />;
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
  tests: PropTypes.array.isRequired,
};

export default SCTest;
