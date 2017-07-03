import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SCMap from '../SCMap';

describe('<MapView />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <SCMap
          activeStores={[]}
          actions={{}}
          overlays={{ points: [], lines: [], polygons: [] }}
          creatingPoints={[]}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
