import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import feature from 'feature';
import FeatureData from '../FeatureData';

describe('<FeatureData />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <FeatureData feature={feature} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
