const { keypress, two_pi, Oscillator, Speaker } = require("./utils");
const oscillator = Oscillator();
const speaker = Speaker();
const pitches = Object.freeze({
  a: 0 / 12,
  b: 2 / 12,
  c: 3 / 12,
  d: 5 / 12,
  e: 7 / 12,
  f: 8 / 12,
  g: 10 / 12
});

let octave = 4;
let note = "a";
let amp = 1;

oscillator.pipe(speaker);

keypress(key => {
  if (key.ctrl && key.name === "c") process.exit();

  if (key.name === "up") octave++;

  if (key.name === "down") octave--;

  if (pitches[key.name] !== undefined) note = key.name;

  oscillator.setFrequency(27.5 * Math.pow(2, octave + pitches[note]));

  console.log(note, octave);
});
