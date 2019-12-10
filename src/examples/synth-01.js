const { synthesizer, signal, sine, log, sawtooth, square } = require("../synth");
const { exit } = require("../utils");

synthesizer(time => {
	// const track1 = signal(sine(signal(sawtooth(2), x => x * 440)))(time);

	// const track2 = signal(sawtooth(440))(time);

	const track1 = signal(square(sine(1)(time) * 200, 0.2))(time);

	const track2 = signal(sine(440))(time);

	return track1 * track2;
}).play();

exit();
