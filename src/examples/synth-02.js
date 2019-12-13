const { synthesizer, signal, sine, sawtooth, square, a, b, g, scale, sum } = require("../synth");
const { exit } = require("../utils");

//-- Additive synthesis

synthesizer(time => {

	const master = scale(0.3)
	
	const track1 = signal(sine(440), master)(time);
	const track2 = signal(sine(880), scale(0.1), master)(time);
	const track3 = signal(sine(1320), scale(0.2), master)(time);
	const track4 = signal(sine(1760), scale(0.5), master)(time);

	return sum(track1, track2, track3, track4);
}).play();

exit();
