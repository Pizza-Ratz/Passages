import React from 'react';
import mapUrl from '../images/map-detail-transparent.svg';

const TrainMapSVG = (props) => {
  const handleMouseOver = (evt) => {
    console.log(evt)
  }

  const imgRef = React.useRef()

  React.useEffect(() => {
    if (imgRef.current.contentDocument) {
      imgRef.current.contentDocument.getElementById('polyline2792')
        .addEventListener('mouseover', handleMouseOver)
    }
  })

  return (
    <object ref={imgRef} id="train-container" data={mapUrl} type="image/svg+xml">interactive subway map</object>
  )
}

export default TrainMapSVG