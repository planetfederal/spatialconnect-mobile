/*global describe, it*/
import React, { View, Text } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import FormData from '../../app/components/FormData';

let mockFormData = [
  {
    formID: 1,
    data: {
      name: 'Frank',
      age: 44
    },
    location: {
      lat: 37.41751498,
      lon: -122.21274345
    },
    id: 6
  },
  {
    formID: 1,
    data: {
      name: 'Frank',
      age: 44
    },
    id: 7
  }
];

describe('<FormData />', () => {

  function setup(props={}) {
    let defaultProps = {

    };
    props = Object.assign(defaultProps, props);

    const component = shallow(
      <FormData {...props} />
    );

    return { component, props };
  }

  it('should render', () => {
    const { component } = setup({form: mockFormData[0]});
    expect(component.length).to.equal(1);
    expect(component.find(View)).to.have.length(1);
    expect(component.find(Text)).to.have.length(4);
  });

  it('should render', () => {
    const { component } = setup({form: mockFormData[1]});
    expect(component.length).to.equal(1);
    expect(component.find(View)).to.have.length(2);
    expect(component.find(Text)).to.have.length(3);
  });

});