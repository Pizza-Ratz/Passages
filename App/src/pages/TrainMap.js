import React from 'react';
import mapUrl from '../images/map-detail-transparent-final2.svg';

export function handleStationSelect(evt) {
  console.log(evt.target)
}

const TrainMapSVG = (props) => {
  const imgRef = React.useRef()

  React.useEffect(() => {
    if (imgRef.current.contentDocument) {
      const xmlDoc = imgRef.current.contentDocument
      const allStations = xmlDoc.querySelectorAll('use[href="#stationMarker"]')
      allStations.forEach(s => s.addEventListener('click', handleStationSelect))
    }
  })

  return (
    <object ref={imgRef} id="train-container" data={mapUrl} type="image/svg+xml">interactive subway map</object>
  )
}

export default TrainMapSVG
