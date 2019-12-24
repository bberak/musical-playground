const {
	synthesizer,
	compose,
	split,
	map,
	filter,
	reduce,
	sine,
	triangle,
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
	log
} = require("../synth");
const { exit, keypress } = require("../utils");

let notes = [];
let modifiers = [];

keypress(key => {
	if ("a,b,c,d,e,f,g".indexOf(key.name) !== -1) {
		if (notes.indexOf(key.name) === -1) notes.push(key.name);
		else notes = notes.filter(x => x !== key.name);
	}

	if (["left", "right", "up", "down"].indexOf(key.name) !== -1) {
		if (modifiers.indexOf(key.name) === -1) modifiers.push(key.name);
		else modifiers = modifiers.filter(x => x !== key.name);
	}

	console.log("Notes", notes);
	console.log("Modifiers", modifiers);
});

synthesizer(time => {
	const chord = compose(
		split(7),
		map(
			compose(a(4), scale(notes.indexOf("a") === -1 ? 0 : 1)),
			compose(b(4), scale(notes.indexOf("b") === -1 ? 0 : 1)),
			compose(c(4), scale(notes.indexOf("c") === -1 ? 0 : 1)),
			compose(d(4), scale(notes.indexOf("d") === -1 ? 0 : 1)),
			compose(e(4), scale(notes.indexOf("e") === -1 ? 0 : 1)),
			compose(f(4), scale(notes.indexOf("f") === -1 ? 0 : 1)),
			compose(g(4), scale(notes.indexOf("g") === -1 ? 0 : 1))
		),
		filter(x => x !== 0),
		reduce((output, input) =>  output * input)
	)(time)

	const lfo1 = sine(5)(time);

	const lfo2 = sine(lfo1)(time);

	const lfo3 = triangle(22)(time);

	return chord * lfo1 * lfo2 * (lfo3 * 0.2);
}).play();

exit();
