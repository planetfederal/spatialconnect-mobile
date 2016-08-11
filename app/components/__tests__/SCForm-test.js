/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SCForm from '../SCForm';
import forms from 'forms';

describe('<SCForm />', () => {

  it('renders correctly - Baseball Team', () => {
    const tree = renderer.create(
      <SCForm formInfo={forms[1]}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});