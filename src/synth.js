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

const toFunction = x => _.isFunction(x) ? x : () => x;

const toFlatArray = (...values) => _.flattenDeep(values || []);

const evaluate = (input, args) => _.isFunction(input) ? input(args) : input;

const signal = (...funcs) => _.flow(toFlatArray(funcs).map(toFunction))

const sine = (frequency, phase) => time => waves.sine(time * frequency, phase)

const sawtooth = (frequency, inverse) => time => waves.sawtooth(time * frequency, inverse);

const square = (frequency, ratio) => time => waves.square(time * frequency, ratio);

const triangle = (frequency, ratio) => time => waves.triangle(time * frequency, ratio); 

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

const sum = (...values) => _.sum(toFlatArray(values));

const average = (...values) => {
	const arr = toFlatArray(values);

	return _.sum(arr) / arr.length;
};

const limit = (min, max) => value => value > max ? max : value < min ? min : value;

const gain = factor => (...values) => _.sum(toFlatArray(values).map(evaluate).map(scale(factor)));

const lowPass = _.memoize((key, samplingRate = 44100) => {
	//-- https://www.musicdsp.org/en/latest/Filters/38-lp-and-hp-filter.html
	let in1 = 0;
	let in2 = 0;

	let out1 = 0;
	let out2 = 0;

	return (cutOff = 200, resonance = 0.7) => {

		const c = 1.0 / Math.tan(Math.PI * cutOff / samplingRate);

		const a1 = 1.0 / (1.0 + resonance * c + c * c);
		const a2 = 2 * a1;
		const a3 = a1;
		const b1 = 2.0 * (1.0 - c * c) * a1;
		const b2 = (1.0 - resonance * c + c * c) * a1;

		return input => {
			const output =
				a1 * input + a2 * in1 + a3 * in2 - b1 * out1 - b2 * out2;

			in2 = in1;
			in1 = input;

			out2 = out1;
			out1 = output;

			return output;
		};
	};
});

const highPass = _.memoize((key, samplingRate = 44100) => {
	//-- https://www.musicdsp.org/en/latest/Filters/38-lp-and-hp-filter.html
	let in1 = 0;
	let in2 = 0;

	let out1 = 0;
	let out2 = 0;

	return (cutOff = 400, resonance = 0.7) => {

	const c = Math.tan((Math.PI * cutOff) / samplingRate);

		const a1 = 1.0 / (1.0 + resonance * c + c * c);
		const a2 = -2 * a1;
		const a3 = a1;
		const b1 = 2.0 * (c * c - 1.0) * a1;
		const b2 = (1.0 - resonance * c + c * c) * a1;

		return input => {
			const output =
				a1 * input + a2 * in1 + a3 * in2 - b1 * out1 - b2 * out2;

			in2 = in1;
			in1 = input;

			out2 = out1;
			out1 = output;

			return output;
		};
	};
});

const movingAverage = _.memoize((key, numSamples = 1024) => {
	
	let samples = [];
	let index = 0;

	return input => {

		if (index === numSamples)
			index = 0;

		samples[index++] = input;

		return _.sum(samples) / samples.length;
	};
});

const apply = (...funcs) => (...args) =>  {
	const arrFunctions = toFlatArray(funcs);
	const arrArgs = toFlatArray(args);

	return arrFunctions.map((f, i) => evaluate(f, arrArgs[i]))
}

const reduce = func => (...args) => toFlatArray(args).reduce(func, 0);

module.exports = {
	Generator: generator,
	Speaker: speaker,
	Oscillator: oscillator,
	Mixer: mixer,
	Synthesizer: synthesizer,
	Synthesize: synthesizer,
	Synth: synthesizer,
	//-- Above aliases are for backwards compatibility --//
	generator,
	speaker,
	oscillator,
	mixer,
	synthesizer,
	synthesize: synthesizer,
	synth: synthesizer,
	toFunction,
	toFlatArray,
	evaluate,
	signal,
	pipe: signal,
	link: signal,
	chain: signal,
	track: signal,
	connect: signal,
	compose: signal,
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
	avg: average,
	limit,
	constrain: limit,
	gain,
	lowPass,
	highPass,
	movingAverage,
	movingAvg: movingAverage,
	apply,
	reduce
};
