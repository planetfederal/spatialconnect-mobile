/*global describe, it*/
import React from 'react';
import { Text } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SCStore from '../../app/components/SCStore';

let mockStore = {
  'type': 'geojson',
  'version': '1',
  'uri': 'all.geojson',
  'isMainBundle':true,
  'id':'63602599-3ad3-439f-9c49-3c8a7579933b',
  'name':'Simple'
};

describe('<SCStore />', () => {
  it('should render', () => {
    const wrapper = shallow(<SCStore store={mockStore}/>);
    expect(wrapper.length).to.equal(1);
    expect(wrapper.find(Text)).to.have.length(4);
  });
});