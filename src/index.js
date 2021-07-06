const teoria = require('teoria')

const line = 'A'
const stopId = 'A24'
const baseNote = teoria.note(`${line}4`)
const scale = baseNote.scale('lydian')

/**
 * Tone.js demo
 */

 const noteMapping = {
  a: 'C4',
  w: 'C#4',
  s: 'D4',
  e: 'D#4',
  d: 'E4',
  f: 'F4',
  t: 'F#4',
  g: 'G4',
  y: 'G#4',
  h: 'A4',
  u: 'A#4',
  j: 'B4',
  k: 'C5'
}

// Create a dictionary of keys being held down to prevent automatic key re-firing
const pressedKeys = {};

const synth = new Tone.MonoSynth();
const dist = new Tone.Distortion(0.5);
const vol = new Tone.Volume(0);
synth.chain(dist, vol, Tone.Destination);

const distSlider = document.getElementById('distortion');
const volSlider = document.getElementById('volume');

document.addEventListener('keydown', evt => {
  // evt.code is always formatted as 'KeyA', 'KeyQ', etc.
  const char = evt.code.slice(3).toLowerCase();
  if (noteMapping[char] && !pressedKeys[char]) {
    pressedKeys[char] = true;
    synth.triggerAttack(noteMapping[char]);
  }
})

document.addEventListener('keyup', evt => {
  const char = evt.code.slice(3).toLowerCase();
  if (noteMapping[char]) {
    delete pressedKeys[char];
    synth.triggerRelease();
  }
})

distSlider.onchange = () => {
  dist.wet.value = Number(distSlider.value) / 100
}

volSlider.onchange = () => {
  vol.volume.value = volSlider.value - 60 // offset to set 60 slider value = 0 (unity) gain
}

/**
 * Given the data for a stop, filters arrival data for selected line and produces
 * quarter-note quantized note data.
 */
function arrivalsToNotes(stopData, line) {
  return stopData.stop_times
    .filter(t => (line) ? t.trip.route.id === line : true)
    .map((st, idx) => ({
      pitch: scale.get(st.arrival.time % 7).midi(),
      quantizedStartStep: idx,
      quantizedEndStep: idx + 1
    }))
}

async function stopToSequence(stopId, line) {
  const req = await fetch(
    `http://localhost:8010/proxy/systems/us-ny-subway/stops/${stopId}`,
    {
      headers: {
        origin: '*'
      }
    }
  )
  const stopData = await req.json()
  const notes = arrivalsToNotes(stopData, line)
  const sequence = {
    notes,
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{time: 0, qpm: 120}],
    totalQuantizedSteps: notes.length
  }

  document.getElementById('station').innerText = stopData.name
  document.getElementById('arrival_count_total').innerText = stopData.stop_times.length
  document.getElementById('arrival_count_line').innerText = notes.length
  document.getElementById('note_data').innerText = JSON.stringify(notes)

  return sequence
}

function handlePlay(phrase) {
  if (player.isPlaying()) {
    player.stop();
    return;
  }

  player.start(phrase)
}

// let player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
let player = new mm.Player()
let music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
music_rnn.initialize()
let origSequence
let generatedSequence

stopToSequence(stopId, line)
  .then(seq => {
    origSequence = seq
    music_rnn.continueSequence(seq, 20, 1.5)
    .then(ph => {
      generatedSequence = ph
      document.getElementById('phrase_data').innerText = JSON.stringify(ph.notes)
    })
  })

document.getElementById('line').innerText = line
document.getElementById('playOrig').onclick = () => handlePlay(origSequence)
document.getElementById('playGen').onclick = () => handlePlay(generatedSequence)
