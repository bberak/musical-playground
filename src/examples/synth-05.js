const { synthesizer, pipe, highPass, lowPass, noise, sine, log, movingAverage } = require("../synth");
const { exit } = require("../utils");

//-- Low Pass Filter

synthesizer(time => {
	const track1 = pipe(
		sine(440),
		//sine(440),
		//lowPass("hp")(time, 0.03),
		movingAverage("ma", 512),
		//averageFilter("avg"),
		//log()
	);

	return track1(time);
}).play();

exit();
