import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { XYZ } from "ol/source";

import apiGoogle from '../../services/apiGeolocationGoogle'


const wmsLayer = new TileLayer({
  visible: true,
  source: new TileWMS({
    url: 'http://localhost:8080/geoserver/layer_pacheco/wms?',
    crossOrigin: 'anonymous',
    params: {
      'LAYERS': 'layer_pacheco:zona_perigo_elevado',
      'TILED': true,
      'VERSION': '1.1.1',
      'FORMAT': 'image/png',
      'SRS': 'EPSG:4326',
    }
  }),
  zIndex: 99
});

const wmsLayerTwo = new TileLayer({
  visible: true,
  source: new TileWMS({
    url: 'http://localhost:8080/geoserver/layer_pacheco/wms?',
    crossOrigin: 'anonymous',
    params: {
      'LAYERS': 'layer_pacheco:perigo_moderado',
      'TILED': true,
      'VERSION': '1.1.1',
      'FORMAT': 'image/png',
      'SRS': 'EPSG:4326',
    }
  }),
  zIndex: 99
});


const googleRoadLayer = new TileLayer({
  source: new XYZ({
    url: `https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}&key=${apiGoogle}`,
    tileSize: 256,
    maxZoom: 20,
    crossOrigin: 'anonymous'
  }),
});

const googleSatelliteLayer = new TileLayer({
  source: new XYZ({
    url: `https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=${apiGoogle}`,
    tileSize: 256,
    maxZoom: 20,
    crossOrigin: 'anonymous'
  }),
});



  const layers = [wmsLayer,wmsLayerTwo,  googleRoadLayer , googleSatelliteLayer];

export { layers };