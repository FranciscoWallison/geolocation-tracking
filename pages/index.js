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
import { Style, Icon } from 'ol/style';
import Feature from 'ol/Feature';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home = () => {
  const mapElement = useRef();
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    let map;
    let view;
    let userLocationLayer;
    let userLocationSource;

    const initMap = () => {
      // Create map
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

      // Create user location layer
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

      // Watch user location
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
      <div
        ref={mapElement}
        className={styles.mapContainer}
      ></div>
    </div>
  );
};

export default Home;
