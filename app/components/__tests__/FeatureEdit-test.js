import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import feature from 'feature';
import FeatureEdit from '../FeatureEdit';

describe('<FeatureEdit />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <FeatureEdit feature={feature} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
