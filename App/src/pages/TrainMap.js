import React from 'react';
import mapUrl from '../images/map.svg';
import { Sequencer } from '../components/Sequencer';

let selectedStations = [
  'A02',
  'A24',
  'A28',
  'A32',
  'A42',
  'A43',
  'A51',
  'H11',
]

function handleStationSelect(evt) {
  // for already-selected station, de-select it
  if (selectedStations.includes(evt.target.mtaId)) {
    //remove selected from the target element's list of classes
    evt.target.classList.remove("selected");
    //do the same for the target element's siblings
    evt.target.previousElementSibling.classList.remove("selected");
    //remove this station from the list of selected stations
    selectedStations = selectedStations.filter(s => s !== evt.target.mtaId)
  } else {
    evt.target.classList.add("selected");
    evt.target.previousElementSibling.classList.add("selected");
    selectedStations.push(evt.target.mtaId);
  }
}

const TrainMapSVG = (props) => {
  const imgRef = React.useRef()

  React.useEffect(() => {
    if (imgRef.current.contentDocument) {
      const xmlDoc = imgRef.current.contentDocument
      // find all stations and label them with their MTA ID (embedded in ID string)
      let allStations = Array.from(xmlDoc.querySelectorAll('circle.station'))
      allStations = allStations.map(s => {
        s.mtaId = s.id.split('_')[0]
        return s
      })
      // make all stations clickable
      allStations.forEach(s => s.addEventListener('click', handleStationSelect))
      // set/unset the 'selected' class on stations based on selectedStations
      allStations.forEach(s => {
        if (selectedStations.includes(s.mtaId)) {
          s.classList.add('selected')
          s.previousElementSibling.classList.add('selected')
        } else {
          s.classList.remove('selected')
          s.previousElementSibling.classList.remove('selected')
        }
      })
    }
  })

  return (
    <>
      <Sequencer gridLength={8} />
      <object ref={imgRef} id="train-container" data={mapUrl} type="image/svg+xml" >interactive subway map</object>
    </>
  )
}

export default TrainMapSVG
