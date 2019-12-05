const _ = require("lodash");
const readline = require("readline");
const Generator = require("audio-generator/stream");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const keypress = cb => {
	process.stdin.on("keypress", (str, key) => cb(key, str));
};

const remap = (n, start1, stop1, start2, stop2) => {
	return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

const two_pi = Math.PI * 2;

const oscillator = args => {
	let wave = _.get(args, "wave", Math.sin);
	let frequency = _.get(args, "frequency", 440);
	let amplitude = _.get(args, "amplitude", 1);

	const generator = Generator(time => {
		const freq = 27.5 * Math.pow(2, octave + pitches[note]);

		return wave(time * two_pi * frequency) * amplitude;
	});

	generator.wave = newWave => wave = newWave;
	generator.frequency = newFrequency => frequency = newFrequency;
	generator.amplitude = newAmplitude => amplitude = newAmplitude;
	generator.mute = () => generator.amplitude(0);

	return generator;
};

module.exports = {
	remap,
	two_pi,
	keypress,
	_,
	oscillator
};