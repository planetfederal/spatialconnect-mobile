import bbox from 'turf-bbox';
import distance from 'turf-distance';

const map = {
  makeCoordinates: (feature) => {
    const makePoint = c => {
      return { latitude: c[1], longitude: c[0] };
    };
    const makeLine = l => {
      return l.map(makePoint);
    };
    const makeMKOverlay = (g) => {
      if (g.type === 'Point') {
        return [makePoint(g.coordinates)];
      } else if (g.type === 'MultiPoint') {
        return g.coordinates.map(makePoint);
      } else if (g.type === 'LineString') {
        return [makeLine(g.coordinates)];
      } else if (g.type === 'MultiLineString') {
        return g.coordinates.map(makeLine);
      } else if (g.type === 'Polygon') {
        return g.coordinates.map(makeLine);
      } else if (g.type === 'MultiPolygon') {
        return g.coordinates.map((p) => {
          return p.map(makeLine);
        }).reduce(function(prev, curr) {
          return prev.concat(curr);
        });
      } else {
        return [];
      }
    };
    return makeMKOverlay(feature.geometry);
  },

  findRegion: (feature) => {
    if (feature.geometry.type === 'Point') {
      return  {
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        latitudeDelta: 1,
        longitudeDelta: 1,
      };
    }
    const [ west, south, east, north ] = bbox(feature);
    const region = {
       //center of bbox
      latitude: (south + north) / 2,
      longitude: (west + east) / 2,
      //delta of bbox plus 50 percent padding
      latitudeDelta: Math.abs(south - north) + Math.abs(south - north)*.5,
      longitudeDelta: Math.abs(west - east) + Math.abs(south - north)*.5,
    };
    return region;
  },

  findPointIndexNearestCenter: (centerPoint, points) => {
    let index = -1;
    let minDistance = false;
    points.forEach((point, idx) => {
      const distanceToCenter = distance(centerPoint, point);
      if (!minDistance || distanceToCenter < minDistance) {
        minDistance = distanceToCenter;
        index = idx;
      }
    });
    return index;
  }
};

export default map;
