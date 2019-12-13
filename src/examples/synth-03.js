const { synthesizer, signal, sine, sawtooth, square, a, b, g, scale, sum } = require("../synth");
const { exit } = require("../utils");

//-- Beating

synthesizer(time => {

	const gain = scale(0.5)
	
	const track1 = signal(sine(330), gain)(time);
	const track2 = signal(sine(330.2), gain)(time);

	return sum(track1, track2);
}).play();

exit();
