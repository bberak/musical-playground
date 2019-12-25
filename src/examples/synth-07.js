const {
	synthesizer,
	compose,
	split,
	map,
	filter,
	reduce,
	sine,
	triangle,
	sawtooth,
	square,
	noise,
	scale,
	a,
	b,
	c,
	d,
	e,
	f,
	g,
	lowPass,
	highPass,
	log
} = require("../synth");
const { exit, keypress } = require("../utils");

const library = {
	"1": d(3),
	"2": e(3),
	"3": f(3),
	"4": g(3),
	"5": a(4),
	"6": b(4),
	"7": c(4),
	"8": d(4),
	"9": e(4),
	"0": f(4),
	"q": sine(320),
	"w": compose(triangle(120), lowPass("w")(220)),
	"e": compose(sawtooth(120), lowPass("e")(220)),
	"r": compose(square(120), lowPass("r")(220)),
	"t": compose(noise, lowPass("t")(260)),
	"y": compose(0),
	"u": compose(0),
	"i": compose(0),
	"o": compose(0),
	"p": compose(0)
};

let effect = library["5"];
let modifiers = [];

keypress(key => {
	if (library[key.name])
		effect = library[key.name]

	if (["left", "right", "up", "down"].indexOf(key.name) !== -1) {
		if (modifiers.indexOf(key.name) === -1) modifiers.push(key.name);
		else modifiers = modifiers.filter(x => x !== key.name);
	}
});

synthesizer(time => {
	const base = effect(time);

	return (
		base *
		compose(
			triangle(120),
			lowPass("lp2")(220)
		)(time) *
		compose(sine(2))(time)
	);
}).play();

exit();
