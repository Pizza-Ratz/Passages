import React from 'react';
import mapUrl from '../images/map-detail-transparent.svg';

const TrainMapSVG = (props) => {
  const handleClick = (evt) => {
    console.log(evt)
  }

  const imgRef = React.useRef()

  React.useEffect(() => {
    if (imgRef.current.contentDocument) {
      imgRef.current.contentDocument.getElementById('polyline2792-2').addEventListener('mouseover', console.log)
    }
  })

  return (
    <object ref={imgRef} id="svg-object" data={mapUrl} type="image/svg+xml"></object>
  )
}

export default TrainMapSVG