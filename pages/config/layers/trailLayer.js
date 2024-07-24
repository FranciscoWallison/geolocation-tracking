import { useEffect } from 'react';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { LineString } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Stroke } from 'ol/style';


const TrailLayer = ({ coordinates }) => {
    const map = useMap();
    const vectorSource = new VectorSource();

    useEffect(() => {
        if (!map) return;

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 3,
                }),
            }),
        });

        map.addLayer(vectorLayer);

        return () => {
            map.removeLayer(vectorLayer);
        };
    }, [map]);

    useEffect(() => {
        if (coordinates.length > 0) {
            const lineString = new LineString(coordinates);
            const feature = new Feature({
                geometry: lineString,
            });
            vectorSource.clear();
            vectorSource.addFeature(feature);
        }
    }, [coordinates]);

    return null;
};

export default TrailLayer;