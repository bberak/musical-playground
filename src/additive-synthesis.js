const Speaker = require("audio-speaker/stream");
const Generator = require("audio-generator/stream");
const { remap, two_pi, keypress, _ } = require("./utils");

const amps = _.range(0, 5).map(x => 1 / 5 / (x + 1));
const width = 800;
const height = 600;

let x = 0;
let y = 0;
let freqs = amps.map(() => 0);

Generator(time => {
  const val = _.sum(
    amps.map((amp, i) => Math.sin(time * two_pi * freqs[i]) * amp)
  );

  return [val];
}).pipe(
  Speaker({
    channels: 1
  })
);

keypress(key => {
  if (key.ctrl && key.name === "c") process.exit();

  if (key.name === "up") y += 10;

  if (key.name === "down") y -= 10;

  if (key.name === "right") x += 10;

  if (key.name === "left") x -= 10;

  const yoffset = remap(y, 0, height, 0, 1);
  const freq = Math.pow(1000, yoffset) + 150;
  const detune = remap(x, 0, width, -0.5, 0.5);

  freqs = amps.map((a, i) => freq * (i + 1 * detune));

  console.log(`x: ${x}/${width}, y: ${y}/${height}`);
});
