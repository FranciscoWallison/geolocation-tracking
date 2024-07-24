
// import '../../sass/btnsMap/containerLegend.scss'




function ContainerLegend() {

    return (
        <>
            <div className="ContainerLegendMapWrapper">
                <p className='titleLegend'>Legenda das zonas demarcada no mapa:</p>
                <div className='containerInfoLegends'>
                    <div className='divOne'></div>
                    <p>Zona de perigo moderado</p>
                </div>

                <div className='containerInfoLegends'>
                    <div className='divTwo'></div>
                    <p>Zona de alto perigo</p>
                </div>


            </div>

        </>
    )
}

export default ContainerLegend