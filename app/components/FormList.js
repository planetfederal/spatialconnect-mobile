import React, {
  Component,
  ListView,
  PropTypes,
  StyleSheet,
  View
} from 'react-native';
import FormCell from './FormCell';
import SCForm from './SCForm';
import api from '../utils/api';
import palette from '../style/palette';

class FormList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  }

  componentDidMount() {
    api.getFormList()
      .then((responseData) => {
        console.log(responseData);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true,
        });
      })
      .catch(() => {});
  }

  selectForm(form) {
    this.props.navigator.push({
      title: '',
      component: SCForm,
      passProps: { formInfo: form }
    });
  }

  renderLoadingView() {
    return (
      <View style={styles.mainContainer}></View>
    );
  }

  renderSeparator(
    sectionID,
    rowID,
    adjacentRowHighlighted
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
      style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  }

  renderRow(
    form,
    sectionID,
    rowID,
    highlightRowFunc
  ) {
    return (
      <FormCell
        key={form.id}
        onSelect={() => this.selectForm(form)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        form={form}
      />
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.mainContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderSeparator={this.renderSeparator.bind(this)}
          renderRow={this.renderRow.bind(this)}
          style={styles.listView}
        />
      </View>
    );
  }
}

FormList.propTypes = {
  navigator: PropTypes.object.isRequired
};

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 0,
    paddingTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: palette.gray
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  listView: {

  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  }
});

export default FormList;