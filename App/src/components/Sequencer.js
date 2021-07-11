import React, { useState, useEffect } from 'react'
import '../styles/global.css'
import * as Tone from 'tone'

let osc
if (typeof window !== "undefined") {
  osc = new Tone.AMSynth().toDestination()
  Tone.Transport.bpm.value = 100;
  Tone.Transport.setLoopPoints(0, "1m");
  Tone.Transport.loop = true;
} else {
  osc = {
    triggerAttackRelease: () => {}
  }
}


export const Sequencer = ({gridLength, selectedStations}) => {

  // Initialize sequencer state
  const [hasPlayed, setHasPlayed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setBeat] = useState(null)

  const pitches = ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'];

  const orderedStations = selectedStations
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))

  const initialSteps = pitches.map(
    (note, idx) => ({note, isActive: true, station: orderedStations[idx]})
  )

  const [activeArray, setActive] = useState(initialSteps);

  // When selected stations changes, return step array with corresponding active/inactive steps
  useEffect(() => {
    setActive(prevActive => prevActive.map(step =>
      ({...step, isActive: selectedStations.includes(step.station)})
    ))}, [selectedStations]
  )

  // Handle timing of sound events
  useEffect(
    () => {
      const loop = new Tone.Sequence(
        (time, position) => {
          setBeat(position)
          if (activeArray[currentBeat] && activeArray[currentBeat].isActive) {
            osc.triggerAttackRelease(activeArray[currentBeat].note, '16n.', time);
          }
        },
        [ 0, 1, 2, 3, 4, 5, 6, 7 ], //position in callback
        "8n"
      ).start(0)
      return () => loop.dispose()
    },
    [ activeArray, currentBeat ] // Retrigger when pattern changes
  )

  const handleStopOrPlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      setBeat(null)
      Tone.Transport.stop();
      Tone.Transport.position = 0;
      Tone.Transport.cancel();
    }
    else {
      if (!hasPlayed) {
        setHasPlayed(true)
        Tone.start()
      }
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }
      setBeat(0)
      setIsPlaying(true)
      Tone.Transport.start()
    }
  }

  // Toggle isActive
  const handleClick = evt => {
    if (evt.target.name) {
      const step = +evt.target.name

      setActive(prevArr => prevArr.map(
        (stepObj, stepIdx) => stepIdx !== step ? stepObj :
          {...stepObj, isActive: !prevArr[step].isActive})
      )
    }
  }

  return (
    <div className="sequencer-container">
    <div className="sequencer">
     {Array(gridLength).fill(<></>).map((_, step) => (
        <button key={step}
        onClick={handleClick}
        name={`${step}`}
        className={
          `beat beat-${step}
          ${activeArray[step].isActive ? "active" : ""}
          ${currentBeat === step ? "current-beat" : ""}`
        }
        aria-label="Toggle note"
        >
        </button>
      ))}
    </div>

    <button
      className={"transport"}
      id="playButton"
      onClick={handleStopOrPlay}>
        {isPlaying ? "Stop" : "Play"}
      </button>
  </div>
  )
}
