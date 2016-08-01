/*global describe, it*/
import React from 'react';
import { ScrollView, Text } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import FeatureData from '../../app/components/FeatureData';

let feature = {
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
};

describe('<FeatureData />', () => {

  function setup(props={}) {
    let defaultProps = {

    };
    props = Object.assign(defaultProps, props);

    const component = shallow(
      <FeatureData {...props} />
    );

    return { component, props };
  }

  it('should render', () => {
    const { component } = setup({feature: feature});
    expect(component.length).to.equal(1);
    expect(component.find(ScrollView)).to.have.length(1);
  });

});