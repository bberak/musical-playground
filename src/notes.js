const Speaker = require("audio-speaker/stream");
const Generator = require("audio-generator/stream");
const { keypress, two_pi } = require("./utils");

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

Generator(time => {
  const freq = 27.5 * Math.pow(2, octave + pitches[note]);

  return [
    Math.sin(time * two_pi * freq) * amp,
    Math.sin(time * two_pi * freq) * amp
  ];
}).pipe(
  Speaker({
    channels: 2
  })
);

keypress(key => {
  if (key.ctrl && key.name === "c") process.exit();

  if (key.name === "up") octave++;

  if (key.name === "down") octave--;

  if (pitches[key.name] !== undefined) note = key.name;

  console.log(note, octave);
});
