const readline = require("readline");
const two_pi = Math.PI * 2;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const keypress = cb => {
	process.stdin.on("keypress", (str, key) => cb(key, str));
};

const remap = (n, start1, stop1, start2, stop2) => {
	return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

module.exports = {
	two_pi,
	remap,
	keypress
};
