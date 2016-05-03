/*global describe, it*/
import React, { TouchableHighlight } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import t from 'tcomb-form-native';
import SCForm from '../../app/components/SCForm';
SCForm.__Rewire__('sc', {
  action: { enableGPS: sinon.spy() },
  stream: { lastKnownLocation: { subscribe: sinon.spy() } }
});
SCForm.__Rewire__('api', {
  saveForm: sinon.spy()
});

let Form = t.form.Form;

let mockForm = {
  'id': 1,
  'name': 'Sample form',
  'schema': {
    'type': 'object',
    'properties': {
      'name': {
        'type': 'string',
        'initialValue': ''
      },
      'age': {
        'type': 'number'
      }
    },
    'required': [
      'name',
      'age'
    ]
  }
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