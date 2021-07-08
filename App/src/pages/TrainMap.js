import React from 'react';
import mapUrl from '../images/map-detail-transparent-final2.svg';

export function handleStationSelect(evt) {
  console.log(evt.target)
}

const selectedStations = [
  'A02',
  'A24',
  'A28',
  'A32',
  'A42',
  'A43',
  'A51',
  'H11',
]

const TrainMapSVG = (props) => {
  const imgRef = React.useRef()

  React.useEffect(() => {
    if (imgRef.current.contentDocument) {
      const xmlDoc = imgRef.current.contentDocument
      // find all stations and extract MTA ID from id string
      let allStations = Array.from(xmlDoc.querySelectorAll('circle.station'))
      allStations = allStations.map(s => { 
        s.mtaId = s.id.match(/[^_]+/)[0]
        return s
      })
      // make all stations clickable
      allStations.forEach(s => s.addEventListener('click', handleStationSelect))
      // set/unset the 'selected' class on stations based on selectedStations
      allStations.forEach(s => {
        if (selectedStations.includes(s.mtaId)) {
          s.classList.add('selected')
        } else {
          s.classList.remove('selected')
        }
      })
      // get all of the station highlights corresponding to the selected stations and make them selected too
      const selStaHighlights = Array.from(xmlDoc.querySelectorAll('circle.station.selected~circle.station-highlight'))
      selStaHighlights.forEach(s => s.classList.add('selected'))
      console.log(selStaHighlights)
    }
  })

  return (
    <object ref={imgRef} id="train-container" data={mapUrl} type="image/svg+xml" >interactive subway map</object>
  )
}

export default TrainMapSVG
