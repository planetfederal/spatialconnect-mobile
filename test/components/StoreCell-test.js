/*global describe, it*/
import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import StoreCell from '../../app/components/StoreCell';

let mockStore = {
  'type': 'geojson',
  'version': '1',
  'uri': 'all.geojson',
  'isMainBundle':true,
  'id':'63602599-3ad3-439f-9c49-3c8a7579933b',
  'name':'Simple'
};

describe('<StoreCell />', () => {

  function setup(props={}) {
    let defaultProps = {
      store: mockStore,
      onSelect: sinon.spy()
    };
    props = Object.assign(defaultProps, props);

    const component = shallow(
      <StoreCell {...props} />
    );

    return { component, props };
  }

  it('should render', () => {
    const { component } = setup();
    expect(component.length).to.equal(1);
    expect(component.find(View)).to.have.length(3);
    expect(component.find(Text)).to.have.length(1);
  });

  it('should click', () => {
    const { component, props } = setup();
    component.find(TouchableHighlight).simulate('press');
    expect(props.onSelect.called).to.be.true;
  });
});