/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import FormSubmitted from '../FormSubmitted';

describe('<FormSubmitted />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <FormSubmitted />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});