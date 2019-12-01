const Speaker = require("audio-speaker/stream");
const Generator = require("audio-generator/stream");
const readline = require("readline");

let freq = 441;

Generator(function(time) {
  //panned unisson effect
  const τ = Math.PI * 2;
  return [Math.sin(τ * time * freq), Math.sin(τ * time * (freq - 2))];
}).pipe(
  Speaker({
    //PCM input format defaults, optional.
    //channels: 2,
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
