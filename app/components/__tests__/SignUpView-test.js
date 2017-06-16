import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { SignUpView } from '../SignUpView';

describe('<SignUpView />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<SignUpView />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows sign up error', () => {
    const tree = renderer.create(<SignUpView signUpError={'Error'} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
