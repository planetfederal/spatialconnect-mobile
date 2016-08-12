/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import FeatureEdit from '../FeatureEdit';
import feature from 'feature';

describe('<FeatureEdit />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <FeatureEdit feature={feature} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});