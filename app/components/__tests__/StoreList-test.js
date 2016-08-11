/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import StoreList from '../StoreList';
import stores from 'stores';

describe('<StoreList />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <StoreList stores={stores} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});