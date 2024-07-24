// import Map from "../components/Map";
import HeaderMap from "./components/header";
import ShowMap from "./components/homeContainer";
// import "./sass/containerMap/map.scss";

import ButtonsMap from "./components/btnsMap";

function Map() {
  return (
    <>
      <div className="ContainerWrapperMap">
        {/* <HeaderMap /> */}
        <ShowMap />
        <ButtonsMap />
      </div>
    </>
  );
}

function Home() {
  return (
    <div>
      <Map />
    </div>
  );
}

export default Home;
