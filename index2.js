const Speaker = require("speaker");
const Generator = require("audio-generator/stream");
const readline = require("readline");

let freq = 441;

Generator(function(time) {
	var τ = Math.PI * 2;
	return [Math.sin(τ * time * freq), Math.sin(τ * time * (freq - 2))];
}).pipe(
	new Speaker({
		//PCM input format defaults, optional.
		//channels: 2,
		//sampleRate: 44100,
		//bitDepth: 16,
		//signed: true,
		//float: false,
	})
);

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
	if (key.ctrl && key.name === "c") process.exit();

	if (key.name === "up") freq += 40;

	if (key.name === "down") freq -= 40;
});

console.log("Press Control + C to exit");
