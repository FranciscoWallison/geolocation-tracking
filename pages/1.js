import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Icon, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Feature from "ol/Feature";
import Head from "next/head";
import styles from "../styles/Geolocation.module.css";

const additionalLocations = {
  "Ponta Grossa - 1": [
    { lat: -4.629986, lon: -37.507352 },
    { lat: -4.629914, lon: -37.507271 },
    { lat: -4.629829, lon: -37.507171 },
    { lat: -4.629794, lon: -37.507108 },
    { lat: -4.629744, lon: -37.507026 },
    { lat: -4.629667, lon: -37.506921 },
    { lat: -4.629589, lon: -37.506873 },
  ],
};

const Home = () => {
  const mapElement = useRef();
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });
  const [isInDangerZone, setIsInDangerZone] = useState(false);
  const [error, setError] = useState(null);
  const [dangerousLocations, setDangerousLocations] = useState([]);

  useEffect(() => {
    let map;
    let view;
    let userLocationLayer;
    let userLocationSource;
    let dangerousLocationSource;
    let dangerousLocationLayer;

    const initMap = () => {
      const initialCenter = fromLonLat([-37.507108, -4.629794]); // Coordenadas desejadas

      view = new View({
        center: initialCenter,
        zoom: 19, // Zoom desejado para o mapa estático
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
            src: "https://openlayers.org/en/latest/examples/data/icon.png",
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
            fill: new Fill({ color: "rgba(255, 0, 0, 0.5)" }),
            stroke: new Stroke({ color: "red", width: 2 }),
          }),
        }),
      });

      map.addLayer(dangerousLocationLayer);

      // Adicionar todas as localizações perigosas à fonte
      Object.values(additionalLocations)
        .flat()
        .forEach((location) => {
          const coordinates = fromLonLat([location.lon, location.lat]);
          const feature = new Feature({
            geometry: new Point(coordinates),
          });
          dangerousLocationSource.addFeature(feature);
        });

      if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ lat: latitude, lon: longitude });

            const coords = fromLonLat([longitude, latitude]);

            const userLocationFeature = new Feature({
              geometry: new Point(coords),
            });

            userLocationSource.clear(true); // Limpar localização anterior
            userLocationSource.addFeature(userLocationFeature);

            // Verificar se o usuário está dentro de uma zona de perigo
            if (isInsideDangerZone(latitude, longitude)) {
              setIsInDangerZone(true);
              map.getViewport().style.backgroundColor = "rgba(255, 0, 0, 0.2)";
              showNotification("Você está em uma área perigosa!");
            } else {
              setIsInDangerZone(false);
              map.getViewport().style.backgroundColor = "transparent";
            }
          },
          (error) => {
            console.error("Error watching position:", error);
            setError("Error watching position: " + error.message);
          },
          {
            enableHighAccuracy: true,
          }
        );
      } else {
        console.error("Geolocation is not available in this browser.");
        setError("Geolocation is not available in this browser.");
      }
    };

    const isInsideDangerZone = (lat, lon) => {
      return Object.values(additionalLocations)
        .flat()
        .some((location) => {
          const latDiff = Math.abs(location.lat - lat);
          const lonDiff = Math.abs(location.lon - lon);
          return latDiff < 0.0001 && lonDiff < 0.0001;
        });
    };

    initMap();

    return () => {
      if (map) {
        map.set;
        map.setTarget(null);
      }
    };
  }, []);

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  };

  const handleTestNotification = () => {
    showNotification("Esta é uma notificação de teste!");
  };

  const addLocation = (locationKey) => {
    setDangerousLocations((prevLocations) => [
      ...prevLocations,
      ...additionalLocations[locationKey],
    ]);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Minha Localização em Tempo Real</title>
      </Head>
      <h1>Minha Localização em Tempo Real</h1>
      <p className={styles.coordinates}>
        Latitude: {coordinates.lat.toFixed(6)}, Longitude:{" "}
        {coordinates.lon.toFixed(6)}
      </p>
      {isInDangerZone && (
        <p className={styles.danger}>Você está em uma área perigosa!</p>
      )}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttonContainer}>
        <button
          onClick={handleTestNotification}
          className={styles.notificationButton}
        >
          Testar Notificação
        </button>
      </div>
      <div ref={mapElement} className={styles.mapContainer}></div>
    </div>
  );
};

export default Home;
