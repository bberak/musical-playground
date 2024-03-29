const { synthesizer, compose, noise, lowPass } = require("../synth");
const { exit } = require("../utils");

//-- Low Pass Filter

synthesizer(time => {
	const track1 = compose(
		noise,
		lowPass("lp")(200),
	)(time)

	return track1;
}).play();

exit();
