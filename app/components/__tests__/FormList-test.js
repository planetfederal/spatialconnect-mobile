/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import FormList from '../FormList';
import forms from 'forms';

describe('<FormList />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <FormList forms={forms} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});