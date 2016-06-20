/*global describe, it*/
import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import FormCell from '../../app/components/FormCell';

let mockForm = {
  id: 1,
  name: 'Sample form'
};

describe('<FormCell />', () => {

  function setup(props={}) {
    let defaultProps = {
      form: mockForm,
      onSelect: sinon.spy(),
      onHighlight: sinon.spy(),
      onUnhighlight: sinon.spy()
    };
    props = Object.assign(defaultProps, props);

    const component = shallow(
      <FormCell {...props} />
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