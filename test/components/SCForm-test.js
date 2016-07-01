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
  "id": 2,
  "name": "Baseball Team",
  "fields": [
    {
      "id": "a214590d-8673-420b-8bca-aa2877b45c52",
      "type": "string",
      "label": "Favorite?",
      "key": "team",
      "position": 0,
      "form_id": 2
    },
    {
      "id": "2a0d1d9b-a44c-44c2-9ea3-9ecd093d9fa6",
      "type": "string",
      "label": "Why?",
      "key": "why",
      "position": 1,
      "form_id": 2
    }
  ]
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