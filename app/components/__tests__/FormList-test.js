import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import forms from 'forms';
import FormList from '../FormList';

describe('<FormList />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <FormList forms={forms} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
