import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import stores from 'stores';
import SCStore from '../SCStore';

describe('<SCStore />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SCStore
        navigation={{
          navigate: jest.fn(),
          state: { params: { store: stores[0] } },
        }}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
