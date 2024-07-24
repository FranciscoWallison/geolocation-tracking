import { Tooltip } from '@mui/material';
import React, {useState} from 'react';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import { mapInstance } from '../../config/layers/showmap';
import { layers } from '../../config/layers/layersMap';



function ChangeMap() {


    const [isRoadMap, setIsRoadMap] = useState(true);

    const handleClick = () => {
        mapInstance.getLayers().clear();

        mapInstance.addLayer(layers[0]);
        mapInstance.addLayer(layers[1]);  

        if (isRoadMap) {
            mapInstance.addLayer(layers[2]);
        } else {
            mapInstance.addLayer(layers[3]); 
        }

        setIsRoadMap(!isRoadMap);
    };

    return (
        <>
            <Tooltip
                title="Trocar mapa"
                placement="left"
                alt="changeMap"
            >
                <div className="ChangeMap">
                    <button className="my-custom-btns" onClick={handleClick}>
                        <MapRoundedIcon />
                    </button>
                    <div className="ChangeMapContent">
                        {' '}
                    </div>
                </div>
            </Tooltip>
        </>
    );
}

export default ChangeMap;
