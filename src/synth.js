const generator = require("audio-generator/stream");
const speaker = require("audio-speaker/stream");
const _ = require("lodash");
const { two_pi } = require("./utils");
const waves = require("periodic-function")

const oscillator = args => {
	let wave = _.get(args, "wave", Math.sin);
	let frequency = _.get(args, "frequency", 440);
	let amplitude = _.get(args, "amplitude", 1);
	let timeScale = _.get(args, "timeScale", 1);

	const _oscillator = generator(time => {
		return wave(time * timeScale * two_pi * frequency) * amplitude;
	});

	_oscillator.getWave = () => wave;
	_oscillator.getFrequency = () => frequency;
	_oscillator.getAmplitude = () => amplitude;
	_oscillator.getTimeScale = () => timeScale;

	_oscillator.setWave = newWave => (wave = newWave);
	_oscillator.setFrequency = newFrequency => (frequency = newFrequency);
	_oscillator.setAmplitude = newAmplitude => (amplitude = newAmplitude);
	_oscillator.setTimeScale = newTimeScale => (timeScale = newTimeScale);
	_oscillator.mute = () => _oscillator.amplitude(0);

	return _oscillator;
};

const mixer = (channels, mapper = x => x) => {
	channels.forEach(c => {
		c.wave = _.get(c, "wave", Math.sin);
		c.frequency = _.get(c, "frequency", 0);
		c.amplitude = _.get(c, "amplitude", 1);
		c.timeScale = _.get(c, "timeScale", 1);
	});

	const _mixer = generator(time => {
		const samples = channels.map(
			({ wave, timeScale, frequency, amplitude }) =>
				wave(time * timeScale * two_pi * frequency) * amplitude
		);

		return mapper(samples);
	});
	_mixer.channels = channels;

	return _mixer;
};

const synthesizer = graph => {

	const synth = generator(graph);

	return {
		play: speakerConfig => synth.pipe(new speaker(speakerConfig))
	}
}

const signal = (...funcs) => _.flow(_.flatten(funcs || []))

const evaluate = (input, args) => _.isFunction(input) ? input(args) : input;

const sine = (frequency, phase) => time => waves.sine(time * evaluate(frequency, time), phase)

const sawtooth = (frequency, inverse) => time => waves.sawtooth(time * evaluate(frequency, time), inverse);

const square = (frequency, ratio) => time => waves.square(time * evaluate(frequency, time), ratio);

const triangle = (frequency, ratio) => time => waves.triangle(time * evaluate(frequency, time), ratio); 

const noise = waves.noise; 

const note = pitch => (octave = 4) => sine(27.5 * Math.pow(2, octave + pitch))

const a = note(0 / 12);

const b = note(2 / 12);

const c = note(3 / 12);

const d = note(5 / 12);

const e = note(7 / 12);

const f = note(8 / 12);

const g = note(10 / 12);

const log = label => value => {
	if (label)
		console.log(label, value)
	else
		console.log(value);

	return value;
}

const split = n => value => _.range(0, n).map(() => value);

const scale = n => value => n * value;

const sum = (...values) => _.sum(_.flatten(values));

const average = (...values) => {
	const arr = _.flatten(values);

	return _.sum(arr) / arr.length;
};

module.exports = {
	generator,
	speaker,
	oscillator,
	mixer,
	synthesizer,
	synthesize: synthesizer,
	synth: synthesizer,

	//-- For backwards compatibility
	Generator: generator,
	Speaker: speaker,
	Oscillator: oscillator,
	Mixer: mixer,
	Synthesizer: synthesizer,
	Synthesize: synthesizer,
	Synth: synthesizer,

	signal,
	pipe: signal,
	link: signal,
	chain: signal,
	track: signal,
	connect: signal,
	timeline: signal,

	sine,
	sin: sine,
	sawtooth,
	saw: sawtooth,
	square,
	triangle,
	noise,
	note,
	a,
	b,
	c,
	d,
	e,
	f,
	g,

	log,
	split,
	scale,
	multiply: scale,
	sum,
	average,
	avg: average
};
