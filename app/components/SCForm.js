import React, {
  Component,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import transform from 'tcomb-json-schema';
import tcomb from 'tcomb-form-native';
import api from '../utils/api';
import palette from '../style/palette';
import scformschema from 'spatialconnect-form-schema/native';
import sc from 'spatialconnect/native';

tcomb.form.Form.i18n = {
  optional: '',
  required: ' *'
};

transform.registerType('date', tcomb.Date);
transform.registerType('time', tcomb.Date);

let Form = tcomb.form.Form;

class FormSuccess extends Component {
  render() {
    return (
      <View style={styles.success}>
        <Text>Form Submitted Successfully.</Text>
      </View>
    );
  }
}

class SCForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      value: {}
    };
  }

  saveForm(formData) {
    this.subscription.dispose();
    api.saveForm(this.props.formInfo.id, this.state.location, formData)
      .then(() => {
        this.props.navigator.push({
          title: '',
          component: FormSuccess
        });
      })
      .catch(() => {
        //TODO handle error submitting form
      });
  }

  onPress () {
    var value = this.refs.form.getValue();
    if (value) {
      this.saveForm(value);
    }
  }

  componentWillMount() {
    sc.action.enableGPS();
    this.subscription = sc.stream.lastKnownLocation.subscribe(
      (data) => this.setState({location: data})
    );

    let { schema, options } = scformschema.translate(this.props.formInfo);
    let initialValues = {};

    for (let prop in schema.properties) {
      if (schema.properties[prop].hasOwnProperty('initialValue')) {
        initialValues[prop] = schema.properties[prop].initialValue;
      }
    }
    this.setState({value: initialValues});
    this.TcombType = transform(schema);
    this.options = options;
  }

  componentWillUnmount() {
    this.subscription.dispose();
  }

  onChange(value) {
    this.setState({value});
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.formName}>
            <Text style={styles.formNameText}>{this.props.formInfo.name}</Text>
          </View>
          <View style={styles.form}>
            <Form
              ref="form"
              value={this.state.value}
              type={this.TcombType}
              options={this.options}
              onChange={this.onChange.bind(this)}
            />
            <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor={palette.lightblue}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }
}

SCForm.propTypes = {
  formInfo: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: palette.gray
  },
  success: {
    flex: 1,
    padding: 10,
    backgroundColor: palette.gray
  },
  scrollView: {
    flex: 1,
    marginBottom: 100
  },
  formName: {
    backgroundColor: palette.gray,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: '#bbb',
    borderBottomWidth: 2
  },
  formNameText: {
    color: '#333',
    fontSize: 24
  },
  form: {
    padding: 20
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: palette.darkblue,
    borderColor: palette.darkblue,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

export default SCForm;
