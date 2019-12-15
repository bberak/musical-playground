const { synthesizer, pipe, highPass, lowPass, noise, sine, log, movingAverage, lowPass2, lowPass3  } = require("../synth");
const { exit } = require("../utils");

//-- Low Pass Filter

synthesizer(time => {
	const track1 = pipe(
		noise,
		//sine(440),
		//sine(440),
		//lowPass("lp")(time, 0.03),
		//lowPass2("lp2")(),
		lowPass3("lp3")(200),
		//movingAverage("ma", 512),
		//averageFilter("avg"),
		//log()
	);

	return track1(time);
}).play();

exit();
