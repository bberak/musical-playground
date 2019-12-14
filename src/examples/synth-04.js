const { synthesizer, signal, sine, lowPass, noise } = require("../synth");
const { exit } = require("../utils");

//-- Low Pass Filter

synthesizer(time => {
	const track1 = signal(noise, v => lowPass("lp")(v, time, 0.015))(time);

	return track1;
}).play();

exit();
