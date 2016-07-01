/*global describe, it*/
import React from 'react';
import { ListView, View } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FormList from '../../app/components/FormList';

let mockForms = [{
  id: 1,
  name: 'Sample form'
},{
  id: 2,
  name: 'Sample form 2'
}];

describe('<FormList />', () => {

  function setup(props={}) {
    let defaultProps = {
      navigator: {}
    };
    props = Object.assign(defaultProps, props);

    const component = shallow(
      <FormList {...props} />
    );

    return { component, props };
  }

  it('should render loading view', () => {
    const { component } = setup();
    expect(component.length).to.equal(1);
    expect(component.find(View)).to.have.length(1);
  });

  it('should render list', () => {
    const { component } = setup();
    component.setState({loaded: true, forms: component.state('dataSource').cloneWithRows(mockForms)});
    expect(component.find(ListView)).to.have.length(1);
  });
});