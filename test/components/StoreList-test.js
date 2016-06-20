/*global describe, it*/
import React from 'react';
import { ListView, Text } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import StoreList from '../../app/components/StoreList';

let mockStores = [{
  'type': 'geojson',
  'version': '1',
  'uri': 'all.geojson',
  'isMainBundle':true,
  'id':'63602599-3ad3-439f-9c49-3c8a7579933b',
  'name':'Simple'
}, {
  'type': 'geojson',
  'version': '1',
  'uri': 'all.geojson',
  'isMainBundle':true,
  'id':'63602599-3ad3-439f-9c49-3c8a7579933b',
  'name':'Simple'
}];

describe('<StoreList />', () => {

  function setup(props={}) {
    let defaultProps = {
      navigator: {}
    };
    props = Object.assign(defaultProps, props);

    const component = shallow(
      <StoreList {...props} />
    );

    return { component, props };
  }

  it('should render loading view', () => {
    const { component } = setup();
    expect(component.length).to.equal(1);
    expect(component.contains(<Text>Loading stores...</Text>)).to.equal(true);
  });

  it('should render list', () => {
    const { component } = setup();
    component.setState({loaded: true, stores: component.state('dataSource').cloneWithRows(mockStores)});
    expect(component.find(ListView)).to.have.length(1);
  });
});