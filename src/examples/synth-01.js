const { synthesizer, signal, sine, a } = require("../synth");
const { exit } = require("../utils");

//-- Combinative synthesis?

synthesizer(time => {
	const track1 = signal(a())(time);
	const track2 = signal(sine(sine(2)))(time);
	const track3 = signal(sine(sine(3)))(time);

	return track1 * track2 * track3;
}).play();

exit();
