import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import forms from 'forms';
import FormCell from '../FormCell';

describe('<FormCell />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<FormCell form={forms[0]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
