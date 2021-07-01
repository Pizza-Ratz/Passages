const teoria = require('teoria')

const line = 'A'
const stopId = 'A24'
const baseNote = teoria.note(`${line}4`)
const scale = baseNote.scale('lydian')

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
