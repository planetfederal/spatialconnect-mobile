import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import stores from 'stores';
import StoreList from '../StoreList';

describe('<StoreList />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<StoreList stores={stores} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
