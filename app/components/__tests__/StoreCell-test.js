import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import stores from 'stores';
import StoreCell from '../StoreCell';

describe('<StoreCell />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <StoreCell store={stores[0]} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
