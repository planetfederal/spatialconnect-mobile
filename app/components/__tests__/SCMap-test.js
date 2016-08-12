/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SCMap from '../SCMap';

describe('<MapView />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <SCMap />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});