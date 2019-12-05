const _ = require("lodash");
const readline = require("readline");
const Generator = require("audio-generator/stream");
const Speaker = require("audio-speaker/stream");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const keypress = cb => {
	process.stdin.on("keypress", (str, key) => cb(key, str));
};

const remap = (n, start1, stop1, start2, stop2) => {
	return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

const two_pi = Math.PI * 2;

const Oscillator = args => {
	let wave = _.get(args, "wave", Math.sin);
	let frequency = _.get(args, "frequency", 440);
	let amplitude = _.get(args, "amplitude", 1);

	const generator = Generator(time => {
		return wave(time * two_pi * frequency) * amplitude;
	});

	generator.getWave = () => wave;
	generator.getFrequency = () => frequency;
	generator.getAmplitude = () => amplitude;

	generator.setWave = newWave => wave = newWave;
	generator.setFrequency = newFrequency => frequency = newFrequency;
	generator.setAmplitude = newAmplitude => amplitude = newAmplitude;
	generator.mute = () => generator.amplitude(0);

	return generator;
};

module.exports = {
	remap,
	two_pi,
	keypress,
	_,
	Oscillator,
	Generator,
	Speaker
};
