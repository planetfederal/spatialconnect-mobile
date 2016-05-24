import React, {
  Component,
  ListView,
  PropTypes,
  StyleSheet,
  Text,
  View
} from 'react-native';
import StoreCell from './StoreCell';
import SCStore from './SCStore';
import sc from 'spatialconnect/native';
import palette from '../style/palette';

class StoreList extends Component {
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
    sc.stream.stores.subscribe(data => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data.stores),
        loaded: true
      });
    });
    sc.action.stores();
  }

  selectStore(store) {
    this.props.navigator.push({
      title: '',
      component: SCStore,
      passProps: { store: store }
    });
  }

  renderLoadingView() {
    return (
      <View style={styles.mainContainer}>
        <Text>
          Loading stores...
        </Text>
      </View>
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
    store,
    sectionID,
    rowID,
    highlightRowFunc
  ) {
    return (
      <StoreCell
        key={store.id}
        onSelect={() => this.selectStore(store)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        store={store}
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

StoreList.propTypes = {
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

export default StoreList;