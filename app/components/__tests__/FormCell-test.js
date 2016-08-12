/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import FormCell from '../FormCell';
import forms from 'forms';

describe('<FormCell />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <FormCell form={forms[0]} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});