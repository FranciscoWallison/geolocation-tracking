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

const PONTA_GROSSA_2 = [
  { lat: -3.674846, lon: -38.663306 },
  { lat: -3.674897, lon: -38.663183 },
  { lat: -3.674929, lon: -38.663086 },
  { lat: -3.674986, lon: -38.662958 },
  { lat: -3.675039, lon: -38.66284 },
  { lat: -3.67512, lon: -38.662714 },
];

const Home = () => {
  const mapElement = useRef();
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });
  const [isInDangerZone, setIsInDangerZone] = useState(false);
  const [error, setError] = useState(null);
  const [lastNotificationTime, setLastNotificationTime] = useState(0);

  useEffect(() => {
    let map;
    let view;
    let userLocationLayer;
    let userLocationSource;
    let dangerousLocationSource;
    let dangerousLocationLayer;

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

      PONTA_GROSSA_2.forEach((location) => {
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
            view.setCenter(coords);

            const userLocationFeature = new Feature({
              geometry: new Point(coords),
            });

            userLocationSource.clear(true); // Clear previous location
            userLocationSource.addFeature(userLocationFeature);

            const currentTime = Date.now();
            if (isInsideDangerZone(latitude, longitude)) {
              setIsInDangerZone(true);
              map.getViewport().style.backgroundColor = "rgba(255, 0, 0, 0.2)";
              if (currentTime - lastNotificationTime > 5 * 60 * 1000) {
                showNotification("Você está em uma área perigosa!");
                setLastNotificationTime(currentTime);
              }
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
      return PONTA_GROSSA_2.some((location) => {
        const latDiff = Math.abs(location.lat - lat);
        const lonDiff = Math.abs(location.lon - lon);
        return latDiff < 0.0001 && lonDiff < 0.0001;
      });
    };

    initMap();

    return () => {
      if (map) {
        map.setTarget(null);
      }
    };
  }, [lastNotificationTime]);

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
