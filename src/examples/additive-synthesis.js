const { remap, keypress } = require("../utils");
const { Mixer, Speaker } = require("../synth");
const _ = require("lodash")
const mixer = Mixer(
  _.range(0, 5).map(num => ({ amplitude: 1 / 5 / (num + 1) })),
  _.sum
);
const width = 800;
const height = 600;

let x = 0;
let y = 0;

mixer.pipe(Speaker({ channels: 1 }));

keypress(key => {
  switch (key.name) {
    case "c": process.exit(); break;
    case "up": y += 10; break;
    case "down": y -= 10; break;
    case "right": x += 10; break;
    case "left": x -= 10;break;
  }

  const yoffset = remap(y, 0, height, 0, 1);
  const freq = Math.pow(1000, yoffset) + 150;
  const detune = remap(x, 0, width, -0.5, 0.5);

  mixer.channels.forEach((c, i) => {
    c.frequency = freq * (i + 1 * detune);
  });

  console.log(`x: ${x}/${width}, y: ${y}/${height}`);
});