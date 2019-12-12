const { synthesizer, signal, sine, sawtooth, square, a, b, g } = require("../synth");
const { exit } = require("../utils");

synthesizer(time => {
	const track1 = signal(sine(440))(time);
	const track2 = signal(sawtooth(440))(time);
	const track3 = signal(square(220))(time);

	return track2
}).play();

exit();
