import { mapInstance } from "../../config/layers/showmap"
import { Tooltip } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
function ZoomInOut() {
    const zoomIn = () => {
      const currentZoom = mapInstance.getView().getZoom()
      const newZoom = currentZoom + 1
  
      mapInstance.getView().animate({
        zoom: newZoom,
        duration: 500
      })
    }
  
    const zoomOut = () => {
      const currentZoom = mapInstance.getView().getZoom()
      const newZoom = currentZoom - 1
  
      mapInstance.getView().animate({
        zoom: newZoom,
        duration: 500
      })
    }
    return (
      <>
        <Tooltip title="Aumentar o zoom" placement="left">
          <button className="my-custom-btns" onClick={zoomIn}>
            <AddRoundedIcon/>
          </button>
        </Tooltip>
  
        <Tooltip title="Diminuir o zoom" placement="left">
          <button className="my-custom-btns" onClick={zoomOut}>
           <RemoveRoundedIcon/>
          </button>
        </Tooltip>
      </>
    )
  }
  
  export default ZoomInOut