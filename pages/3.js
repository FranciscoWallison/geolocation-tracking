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
  "Pacheco - 1": [
    { lat: -3.682177, lon: -38.653742 },
    { lat: -3.682283, lon: -38.653476 },
    { lat: -3.682351, lon: -38.653309 },
    { lat: -3.682426, lon: -38.653097 },
    { lat: -3.682525, lon: -38.652945 },
    { lat: -3.682623, lon: -38.652755 },
    { lat: -3.682691, lon: -38.652581 },
    { lat: -3.682782, lon: -38.652429 },
    { lat: -3.682873, lon: -38.652255 },
    { lat: -3.682956, lon: -38.652088 },
    { lat: -3.683017, lon: -38.651921 },
    { lat: -3.683077, lon: -38.651761 },
    { lat: -3.683161, lon: -38.651587 },
    { lat: -3.683244, lon: -38.651428 },
    { lat: -3.683373, lon: -38.651261 },
    { lat: -3.683456, lon: -38.651132 },
    { lat: -3.683562, lon: -38.651033 },
    { lat: -3.683653, lon: -38.650919 },
    { lat: -3.683744, lon: -38.650806 },
    { lat: -3.683797, lon: -38.650639 },
    { lat: -3.683865, lon: -38.650426 },
    { lat: -3.683986, lon: -38.650252 },
    { lat: -3.684039, lon: -38.650062 },
    { lat: -3.684115, lon: -38.649895 },
    { lat: -3.684183, lon: -38.649751 },
    { lat: -3.684274, lon: -38.649607 },
    { lat: -3.68438, lon: -38.649478 },
    { lat: -3.684455, lon: -38.649326 },
    { lat: -3.684516, lon: -38.649137 },
    { lat: -3.684592, lon: -38.649 },
    { lat: -3.68466, lon: -38.648856 },
    { lat: -3.684652, lon: -38.648689 },
    { lat: -3.684751, lon: -38.648606 },
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
      // lat: -3.683373, lon: -38.651261
      const initialCenter = fromLonLat([-38.651261, -3.683373]); // Coordenadas desejadas

      view = new View({
        center: initialCenter,
        zoom: 18 // Zoom desejado para o mapa estático
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
