/*global describe,it,expect*/
import map from '../map';

let pt = {
  "type": "Feature",
  "properties": {
    "foo": "bar"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      -105.46875,
      57.89149735271031
    ]
  }
};

let pts = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -105.84228515625,
          57.96733074626976
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -104.776611328125,
          58.21702494960191
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -104.5458984375,
          57.903174456371495
        ]
      }
    }
  ]
};

let polygon = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          -102.74414062499999,
          69.68761843185617
        ],
        [
          -106.34765625,
          68.52823492039876
        ],
        [
          -102.3046875,
          67.03316279015063
        ],
        [
          -97.119140625,
          67.90861918215302
        ],
        [
          -98.173828125,
          69.59589006237648
        ],
        [
          -102.74414062499999,
          69.68761843185617
        ]
      ]
    ]
  }
};

describe('map utils', () => {
  it('makes coordinates - point', () => {
    let c = map.makeCoordinates(pt);
    expect(c.length).toEqual(1);
    expect(c[0].latitude).toEqual(pt.geometry.coordinates[1]);
    expect(c[0].longitude).toEqual(pt.geometry.coordinates[0]);
  });

  it('makes coordinates - polygon', () => {
    let c = map.makeCoordinates(polygon);
    expect(c.length).toEqual(1);
    expect(c[0].length).toEqual(6);
  });

  it('finds region - polygon', () => {
    let r = map.findRegion(polygon);
    expect(r.latitude).toBeDefined();
    expect(r.longitude).toBeDefined();
    expect(r.latitudeDelta).toBeGreaterThan(0);
    expect(r.longitudeDelta).toBeGreaterThan(0);
  });

  it('finds nearest point', () => {
    let n = map.findPointNearestCenter(pt, pts.features);
    expect(n).toEqual(pts.features[0]);
  });

});