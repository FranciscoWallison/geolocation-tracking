import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { layers } from './layersMap';

const projection = 'EPSG:4326';
const center = [-38.6514543, -3.6832602];
const zoom = 18;


const mapInstance = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    projection: projection,
    center: center,
    zoom: zoom,
  }),
  controls: []
});

export { mapInstance, zoom, center };

