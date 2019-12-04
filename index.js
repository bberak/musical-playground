const Speaker = require("audio-speaker/stream");
const Generator = require("audio-generator/stream");
const readline = require("readline");
const TWO_PI = Math.PI * 2;

let freq = 27.6;
let amp = 1;

Generator(time => {
  return [
    Math.sin(time * freq * TWO_PI) * amp,
    Math.sin((time - 0.5) * freq * TWO_PI) * amp
  ];
}).pipe(
  Speaker({
    channels: 2
    //sampleRate: 44100,
    //byteOrder: 'LE',
    //bitDepth: 16,
    //signed: true,
    //float: false,
    //interleaved: true
  })
);

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") process.exit();

  if (key.name === "up") freq += 40;

  if (key.name === "down") freq -= 40;
});

console.log("Press Control + C to exit");
