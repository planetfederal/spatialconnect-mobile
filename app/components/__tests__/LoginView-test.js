/*global jest,describe,it,expect*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { LoginView } from '../LoginView';

describe('<LoginView />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <LoginView />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});