/*global describe, it*/
import React from 'react';
import { View, Text } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import FormData from '../../app/components/FormData';

let formData = [{
  "id": 7,
  "val": {
    "id": "(null).REVGQVVMVF9TVE9SRS1CRDhDOUE5OC1DODg5LTQyNUYtQkY5Ni1EQ0IxNzE2NEM4Q0M=.NQ==",
    "geometry": {
      "type": "Point",
      "coordinates": [
        -75.61079864397236,
        38.35388793147947,
        0
      ]
    },
    "bbox": [
      0,
      0,
      0,
      0
    ],
    "properties": {
      "team": "O's",
      "why": "testing"
    },
    "crs": {
      "type": "name",
      "properties": {
        "name": "EPSG:4326"
      }
    },
    "metadata": {
      "created_at": "2016-06-17 14:30:52 EDT",
      "client": "BD8C9A98-C889-425F-BF96-DCB17164C8CC"
    },
    "type": "Feature"
  },
  "form": {
    "id": 2,
    "name": "Baseball Team",
    "fields": [
      {
        "id": "a214590d-8673-420b-8bca-aa2877b45c52",
        "type": "string",
        "label": "Favorite?",
        "key": "team",
        "position": 0
      },
      {
        "id": "2a0d1d9b-a44c-44c2-9ea3-9ecd093d9fa6",
        "type": "string",
        "label": "Why?",
        "key": "why",
        "position": 1
      }
    ]
  }
}];

describe('<FormData />', () => {

  function setup(props={}) {
    let defaultProps = {

    };
    props = Object.assign(defaultProps, props);

    const component = shallow(
      <FormData {...props} />
    );

    return { component, props };
  }

  it('should render', () => {
    const { component } = setup({formData: formData[0]});
    expect(component.length).to.equal(1);
    expect(component.find(View)).to.have.length(1);
  });

});