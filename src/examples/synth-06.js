const { synthesizer, compose, noise, highPass } = require("../synth");
const { exit } = require("../utils");

//-- High Pass Filter

synthesizer(time => {
	const track1 = compose(
		noise,
		highPass("hp")(1800)
	)(time)

	return track1;
}).play();

exit();
