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


/*
const master = scale(0.3)

const track1 = signal(sine(440), master)(time);
const track2 = signal(sine(880), scale(0.1), master)(time);
const track3 = signal(sine(1320), scale(0.2), master)(time);
const track4 = signal(sine(1760), scale(0.5), master)(time);

return sum(track1, track2, track3, track4);
*/

/*
return _.sum(
	[
		sine(440)(time),
		sine(880)(time) * 0.1,
		sine(1320)(time) * 0.2,
		sine(1760)(time) * 0.5
	].map(x => x * 0.3)
);
*/