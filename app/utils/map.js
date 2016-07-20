let map = {
  makeCoordinates(feature) {
    let makePoint = c => {
      return { latitude: c[1], longitude: c[0] };
    };
    let makeLine = l => {
      return l.map(makePoint);
    };
    let makeMKOverlay = (g) => {
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
    let coordinates = makeMKOverlay(feature.geometry);
    return coordinates;
  }
};

export default map;
