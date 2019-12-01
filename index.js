const Readable = require("stream").Readable;
const bufferAlloc = require("buffer-alloc");
const Speaker = require("speaker");
const readline = require("readline");

// the frequency to play
let freq = 160;

// A SineWaveGenerator readable stream
const sine = new Readable();
sine.bitDepth = 16;
sine.channels = 2;
sine.sampleRate = 44100;
sine.samplesGenerated = 0;
sine._read = read;

// create a SineWaveGenerator instance and pipe it to the speaker
sine.pipe(new Speaker())

// the Readable "_read()" callback function
function read(n) {
  const sampleSize = this.bitDepth / 8;
  const blockAlign = sampleSize * this.channels;
  const numSamples = (n / blockAlign) | 0;
  const buf = bufferAlloc(numSamples * blockAlign);
  const amplitude = 32760; // Max amplitude for 16-bit audio

  // the "angle" used in the function, adjusted for the number of
  // channels and sample rate. This value is like the period of the wave.
  const t = (Math.PI * 2 * freq) / this.sampleRate;

  for (let i = 0; i < numSamples; i++) {
    // fill with a simple sine wave at max amplitude
    for (let channel = 0; channel < this.channels; channel++) {
      const s = this.samplesGenerated + i;
      const val = Math.round(amplitude * Math.sin(t * s)); // sine wave
      const offset = i * sampleSize * this.channels + channel * sampleSize;
      buf[`writeInt${this.bitDepth}LE`](val, offset);
    }
  }

  this.push(buf);

  this.samplesGenerated += numSamples;
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {

  if (key.ctrl && key.name === "c") process.exit();

  if (key.name === "up") freq += 40;

  if (key.name === "down") freq -= 40;
});

console.log("Press Control + C to exit");
