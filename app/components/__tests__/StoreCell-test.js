/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import StoreCell from '../StoreCell';
import stores from 'stores';

describe('<StoreCell />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <StoreCell store={stores[0]} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});