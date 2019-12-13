const {
	synthesizer,
	signal,
	sine,
	sawtooth,
	square,
	a,
	b,
	g,
	scale,
	sum,
	gain,
	pipe,
	chain
} = require("../synth");
const { exit } = require("../utils");

//-- Additive synthesis

synthesizer(time => {

	const master = gain(0.3);

	const track = master(
		sine(440)(time),
		chain(sine(880), scale(0.1))(time),
		chain(sine(1320), scale(0.2))(time),
		chain(sine(1760), scale(0.5))(time)
	);

	return track;
}).play();

exit();
