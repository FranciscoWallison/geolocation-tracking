import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from '@mui/material';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature';


import React, { useState } from 'react';

import { mapInstance } from '../../config/layers/showmap';
import { vector } from '../../config/layers/vector';
import locationIcon from '../../assets/img/personicon.svg';
import apiGoogle from '../../services/apiGeolocationGoogle';

const apiKey = apiGoogle

function FindUser() {
  const [watchId, setWatchId] = useState(null);

  const buscarLocalizacao = async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          considerIp: true
        })
      });


      if (!response.ok) {
        throw new Error('Erro ao obter a localização');
      }

      const data = await response.json();
      const { location } = data;

      const coords = [location.lng, location.lat];
      const point = new Point(coords);
      const pointFeature = new Feature(point);
      

      const vectorStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: locationIcon,
          scale: 0.1 
        })
      });

   
      const markerLayer = new VectorLayer({
        source: new VectorSource({
          features: [pointFeature] 
        }),
        style: vectorStyle 
      });

      vector.getSource().clear();
      vector.getSource().addFeature(pointFeature);

      mapInstance.addLayer(markerLayer);
      mapInstance.getView().setCenter(coords);
      mapInstance.getView().setZoom(20);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  };

  const handleButtonClick = () => {
    if (watchId === null) {
      buscarLocalizacao();
      setWatchId(setInterval(buscarLocalizacao, 2000));
    } else {
      clearInterval(watchId);
      setWatchId(null);
    }
  };

  return (
    <div>
      <Tooltip title="Mostrar sua localização" placement="left">
        <button onClick={handleButtonClick} className="my-custom-btns">
          <LocationOnIcon />
        </button>
      </Tooltip>
    </div>
  );
}

export default FindUser;