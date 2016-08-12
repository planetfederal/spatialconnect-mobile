/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import FeatureData from '../FeatureData';
import feature from 'feature';

describe('<FeatureData />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <FeatureData feature={feature} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});