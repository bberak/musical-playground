const { synthesizer, pipe, lowPass, noise } = require("../synth");
const { exit } = require("../utils");

//-- Low Pass Filter

synthesizer(time => {
	const track1 = pipe(
		noise(time),
		lowPass("lp")(time, 0.015)
	);

	return track1();
}).play();

exit();
