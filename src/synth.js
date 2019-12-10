const Generator = require("audio-generator/stream");
const Speaker = require("audio-speaker/stream");
const _ = require("lodash");
const { two_pi } = require("./utils");

const Oscillator = args => {
	let wave = _.get(args, "wave", Math.sin);
	let frequency = _.get(args, "frequency", 440);
	let amplitude = _.get(args, "amplitude", 1);
	let timeScale = _.get(args, "timeScale", 1);

	const generator = Generator(time => {
		return wave(time * timeScale * two_pi * frequency) * amplitude;
	});

	generator.getWave = () => wave;
	generator.getFrequency = () => frequency;
	generator.getAmplitude = () => amplitude;
	generator.getTimeScale = () => timeScale;

	generator.setWave = newWave => (wave = newWave);
	generator.setFrequency = newFrequency => (frequency = newFrequency);
	generator.setAmplitude = newAmplitude => (amplitude = newAmplitude);
	generator.setTimeScale = newTimeScale => (timeScale = newTimeScale);
	generator.mute = () => generator.amplitude(0);

	return generator;
};

const Mixer = (channels, mapper = x => x) => {
	channels.forEach(c => {
		c.wave = _.get(c, "wave", Math.sin);
		c.frequency = _.get(c, "frequency", 0);
		c.amplitude = _.get(c, "amplitude", 1);
		c.timeScale = _.get(c, "timeScale", 1);
	});

	const mixer = Generator(time => {
		const samples = channels.map(
			({ wave, timeScale, frequency, amplitude }) =>
				wave(time * timeScale * two_pi * frequency) * amplitude
		);

		return mapper(samples);
	});
	mixer.channels = channels;

	return mixer;
};

module.exports = {
	Generator,
	Speaker,
	Oscillator,
	Mixer
};
