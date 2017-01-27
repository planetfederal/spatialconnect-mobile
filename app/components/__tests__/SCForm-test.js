import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import forms from 'forms';
import SCForm from '../SCForm';

describe('<SCForm />', () => {
  it('renders correctly - Baseball Team', () => {
    const tree = renderer.create(
      <SCForm formInfo={forms[0]} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
