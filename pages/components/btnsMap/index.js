import ZoomInOut from "../../features/ButtonsMap/zoommap";
import RendMap from "../../features/ButtonsMap/rendMap";
// import "../../sass/btnsMap/btnsMap.scss";
import FindUser from "../../features/ButtonsMap/userLocation";
import ChangeMap from "../../features/ButtonsMap/changeMap";
import { Container } from "react-bootstrap";
import ContainerLegend from "./containerLegend";

function ButtonsMap() {
  return (
    <>
      <div className="ContainerBtnsMapWrapper">
        <FindUser />
        <RendMap />
        <ZoomInOut />
        <ChangeMap />
        <ContainerLegend />
      </div>
    </>
  );
}

export default ButtonsMap;
