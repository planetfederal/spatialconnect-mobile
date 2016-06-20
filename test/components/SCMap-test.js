/*global describe, it*/
import React from 'react';
import { MapView } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SCMap from '../../app/components/SCMap';

describe('<SCMap />', () => {

  function setup(props={}) {
    let defaultProps = {
      navigator: {},
    };
    props = Object.assign(defaultProps, props);

    const component = shallow(
      <SCMap {...props} />
    );

    return { component, props };
  }

  it('should render', () => {
    const { component } = setup();
    expect(component.length).to.equal(1);
    expect(component.find(MapView)).to.have.length(1);
  });

});