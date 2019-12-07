const { Readable, Writable, Transform } = require("stream");

const createReadStream = val => {
	const rs = Readable({ objectMode: true });
	let count = 0;
	rs._read = () => {
		if (count > 5) rs.push(null);
		else {
			rs.push(val);
			count++;
		}
	};

	return rs;
};

const createWriteSteam = () => {
	const ws = Writable({ objectMode: true });

	ws._write = (chunk, enc, next) => {
		console.log(chunk);
		next();
	};

	return ws;
};

const combine = streams => {
	const rs = Readable({ objectMode: true });

	rs._read = () => {
		const vals = streams.map(s => s.read()).filter(x => x);

		if (vals.length) rs.push(vals);
		else rs.push(null);
	};

	return rs;
};

const transform = func => {
	const ts = Transform({ objectMode: true });

	ts._transform = (input, enc, next) => {
		ts.push(func(input));
		next();
	};

	return ts;
};


const rs = combine([createReadStream("a"), createReadStream("b")]);
const toUpper = transform(input => input.map(x => x.toUpperCase()));
const ws = createWriteSteam();

rs.pipe(toUpper).pipe(transform(input => input.join(","))).pipe(ws);
