/*global describe, it*/
import React from 'react';
import { TouchableHighlight } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import t from 'tcomb-form-native';
import SCForm from '../../app/components/SCForm';

let Form = t.form.Form;

let mockForm = {
  id: 2,
  version: 0,
  form_key: 'baseball_team',
  form_label: 'Baseball Team',
  fields: [{
    id: 13,
    type: 'string',
    field_label: 'Favorite?',
    field_key: 'team',
    position: 0
  }, {
    id: 14,
    type: 'string',
    field_label: 'Why?',
    field_key: 'why',
    position: 1
  }]
};

describe('<SCForm />', () => {

  function setup(props={}) {
    let defaultProps = {
      navigator: {}
    };
    props = Object.assign(defaultProps, props);

    const component = shallow(
      <SCForm {...props} />
    );

    return { component, props };
  }

  it('should render form', () => {
    const { component } = setup({formInfo: mockForm});
    expect(component.length).to.equal(1);
    expect(component.find(Form)).to.have.length(1);
  });

  it('should handle submit', () => {
    SCForm.prototype.onPress = sinon.spy();
    const { component } = setup({formInfo: mockForm});
    component.find(TouchableHighlight).simulate('press');
    expect(SCForm.prototype.onPress.calledOnce).to.be.true;
  });

});