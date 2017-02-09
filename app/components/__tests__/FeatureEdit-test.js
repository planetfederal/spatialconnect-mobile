import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import feature from 'feature';
import FeatureEdit from '../FeatureEdit';

const mockStore = configureMockStore();

describe('<FeatureEdit />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <FeatureEdit
        navigation={{
          navigate: jest.fn(),
          state: { params: { feature } },
        }}
        store={mockStore()}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
