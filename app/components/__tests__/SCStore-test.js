/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SCStore from '../SCStore';
import stores from 'stores';

describe('<SCStore />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <SCStore storeInfo={stores[0]} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});