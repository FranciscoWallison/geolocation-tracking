// pages/index.js

import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import Feature from 'ol/Feature';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home = () => {
  const mapElement = useRef();
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });
  const [isInDangerZone, setIsInDangerZone] = useState(false);

  useEffect(() => {
    let map;
    let view;
    let userLocationLayer;
    let userLocationSource;
    let dangerousLocationSource;
    let dangerousLocationLayer;

    const dangerousLocations = [
      { lat: -3.819914, lon: -38.523600 },
      { lat: -3.819921, lon: -38.523479 },
      { lat: -3.820022, lon: -38.523541 },
      { lat: -3.819847, lon: -38.5235827 },
      { lat: -3.819874, lon: -38.5234946 },
      { lat: -3.8199004, lon: -38.523406 },
      { lat: -3.8199251, lon: -38.5233156 },
    ];

    const isInsideDangerZone = (lat, lon) => {
      return dangerousLocations.some((location) => {
        const latDiff = Math.abs(location.lat - lat);
        const lonDiff = Math.abs(location.lon - lon);
        return latDiff < 0.0001 && lonDiff < 0.0001;
      });
    };

    const initMap = () => {
      view = new View({
        center: fromLonLat([0, 0]),
        zoom: 10,
      });

      map = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: view,
      });

      userLocationSource = new VectorSource();
      userLocationLayer = new VectorLayer({
        source: userLocationSource,
        style: new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          }),
        }),
      });

      map.addLayer(userLocationLayer);

      dangerousLocationSource = new VectorSource();
      dangerousLocationLayer = new VectorLayer({
        source: dangerousLocationSource,
        style: new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: 'rgba(255, 0, 0, 0.5)' }),
            stroke: new Stroke({ color: 'red', width: 2 }),
          }),
        }),
      });

      map.addLayer(dangerousLocationLayer);

      dangerousLocations.forEach(location => {
        const coordinates = fromLonLat([location.lon, location.lat]);
        const feature = new Feature({
          geometry: new Point(coordinates),
        });
        dangerousLocationSource.addFeature(feature);
      });

      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ lat: latitude, lon: longitude });

            const coords = fromLonLat([longitude, latitude]);
            view.setCenter(coords);
            view.setZoom(20);

            const userLocationFeature = new Feature({
              geometry: new Point(coords),
            });

            userLocationSource.clear(true); // Clear previous location
            userLocationSource.addFeature(userLocationFeature);

            // Check if the user is inside a danger zone
            if (isInsideDangerZone(latitude, longitude)) {
              setIsInDangerZone(true);
              map.getViewport().style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            } else {
              setIsInDangerZone(false);
              map.getViewport().style.backgroundColor = 'transparent';
            }
          },
          (error) => {
            console.error('Error watching position:', error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      } else {
        console.error('Geolocation is not available in this browser.');
      }
    };

    initMap();

    return () => {
      if (map) {
        map.setTarget(null);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Minha Localização em Tempo Real</title>
      </Head>
      <h1>Minha Localização em Tempo Real</h1>
      <p className={styles.coordinates}>
        Latitude: {coordinates.lat.toFixed(6)}, Longitude: {coordinates.lon.toFixed(6)}
      </p>
      {isInDangerZone && <p className={styles.danger}>Você está em uma área perigosa!</p>}
      <div
        ref={mapElement}
        className={styles.mapContainer}
      ></div>
    </div>
  );
};

export default Home;
