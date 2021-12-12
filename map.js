const data = {
	SVGNodesPositions: {
		shibin: { cx: 32, cy: 25 },
		sirs: { cx: 25, cy: 3 },
		menouf: { cx: 5, cy: 5 },
		elbagour: { cx: 37.5, cy: 7.5 },
		elsadat: { cx: 15, cy: 40 },
		ashmon: { cx: 45, cy: 25 },
		shohada: { cx: 25, cy: 47.5 },
		quesna: { cx: 3, cy: 25 },
		tala: { cx: 45, cy: 15 },
		berket: { cx: 45, cy: 45 },
	},

	config: {
		nodeActiveColor: "red",
		nodeStrokeColor: "green",
		nodeStrokeWidth: "2px",
		nodeRadius: 10,
		nodeFillColor: "yellow",
		nodeInactiveColor: "yellow",
		lineActiveColor: "yellow",
		lineInActiveColor: "black",
		lineWidth: "2px",
	},

	roads: {
		shibin: ["shohada", "menouf", "tala", "elbagour", "berket", "ashmon", "quesna", "elsadat"],
		sirs: ["menouf", "elbagour"],
		menouf: ["sirs", "shibin", "elsadat"],
		elbagour: ["shibin", "sirs"],
		elsadat: ["shibin", "menouf"],
		ashmon: ["shibin"],
		shohada: ["shibin"],
		quesna: ["shibin"],
		tala: ["shibin"],
		berket: ["shibin"],
	},

	mapRoads: {
		shibin: ["menouf", "tala", "elbagour", "shohada", "elsadat", "berket", "ashmon", "quesna"],
		sirs: ["menouf", "elbagour"],
		elsadat: ["menouf"],
	},

	distances: {
		shibin: {
			tala: 18,
			shohada: 16.5,
			menouf: 16.4,
			elbagour: 14.6,
			quesna: 18.7,
			berket: 14,
			ashmon: 42.2,
			elsadat: 61.4,
		},
		sirs: { menouf: 4.2, elbagour: 7.1 },
		menouf: { sirs: 4.2, shibin: 16.1, elsadat: 55.9 },
		tala: { shibin: 18 },
		berket: { shibin: 14 },
		elbagour: { shibin: 14.9, sirs: 7.1 },
		ashmon: { shibin: 42.2 },
		quesna: { shibin: 18.1 },
		elsadat: { shibin: 61.4, menouf: 54.5 },
		shohada: { shibin: 17.5 },
	},

	Coordinates: {
		shibin: [30.55492, 31.01239],
		sirs: [30.4427159, 30.96665],
		menouf: [30.4584, 30.93386],
		tala: [30.68312, 30.95003],
		berket: [30.62749, 31.0724],
		elbagour: [30.4318, 31.03198],
		ashmon: [30.30011, 30.9756],
		quesna: [30.5676, 31.14956],
		elsadat: [30.36281, 30.53315],
		shohada: [30.5976, 30.89575],
	},
};

Object.keys(data.Coordinates).forEach((node) => {
	data.Coordinates[node] = data.Coordinates[node].map((coordinate) =>
		Math.round((coordinate - 30) * 100)
	);
});

class QElement {
	constructor(node, priority) {
		this.node = node;
		this.priority = priority;
	}
}

class PriorityQueue {
	constructor() {
		this.items = [];
	}

	enqueue(element, priority) {
		var qElement = new QElement(element, priority);
		var contain = false;

		for (var i = 0; i < this.items.length; i++)
			if (this.items[i].priority > qElement.priority) {
				this.items.splice(i, 0, qElement);
				contain = true;
				break;
			}

		if (!contain) this.items.push(qElement);
	}
}

const { SVGNodesPositions, roads, mapRoads, config, distances, Coordinates } = data;
let visited = new Set();
let path = new Set();
let timeout;

const Utils = {
	colorizeElement: function (type, className, color) {
		let elementProp = {
			node: "fill",
			line: "stroke",
		};
		document.querySelector(`.${className}`).style[elementProp[type]] = color;
	},

	resetNodesPath: function () {
		for (let i = 0; i < timeout; i++) clearTimeout(i);
		for (node of visited) this.colorizeElement("node", node, config.nodeInactiveColor);
		for (line of path) this.colorizeElement("line", line, config.lineInActiveColor);
	},

	debounce: function () {
		let counter = 0;

		function resetCounter() {
			counter = 0;
		}

		function delayBy(callback, delay = 1) {
			counter++;
			timeout = setTimeout(() => {
				callback.call();
			}, delay * 1000 * counter);
		}

		return {
			resetCounter,
			delayBy,
		};
	},

	addNodeName(text) {
		const x = document.querySelector(`.${text}`).cx.animVal.value;
		const y = document.querySelector(`.${text}`).cy.animVal.value;
		const name = document.createElementNS("http://www.w3.org/2000/svg", "text");
		name.setAttribute("x", `${x + 10}`);
		name.setAttribute("y", `${y + 15}`);
		name.innerHTML = text;
		svg.appendChild(name);
	},

	addNodeCircle(id) {
		const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		const circleData = SVGNodesPositions[id];

		let ratio = screen.width / (70 * (screen.width < 768 ? 1 : 2));

		const circleConfig = {
			class: id,
			cx: circleData.cx * ratio,
			cy: circleData.cy * ratio,
			r: config.nodeRadius,
			fill: config.nodeInactiveColor,
			stroke: config.nodeStrokeColor,
			"stroke-width": config.nodeStrokeWidth,
		};
		Object.keys(circleConfig).forEach((attribute) => {
			circle.setAttribute(attribute, circleConfig[attribute]);
		});

		svg.appendChild(circle);
	},

	addLineBetween(start, distination) {
		const lineConfig = {
			x1: document.querySelector(`.${start}`).cx.animVal.value,
			x2: document.querySelector(`.${distination}`).cx.animVal.value,
			y1: document.querySelector(`.${start}`).cy.animVal.value,
			y2: document.querySelector(`.${distination}`).cy.animVal.value,
			class: `${start}-${distination} ${distination}-${start}`,
			stroke: config.lineInActiveColor,
			"stroke-width": config.lineWidth,
		};

		const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

		Object.keys(lineConfig).forEach((attribute) => {
			line.setAttribute(attribute, `${lineConfig[attribute]}`);
		});

		svg.appendChild(line);
	},

	calculateHeuristic(node, destination) {
		return Math.round(
			Math.sqrt(
				Math.pow(Math.abs(Coordinates[node][0] - Coordinates[destination][0]), 2) +
				Math.pow(Math.abs(Coordinates[node][1] - Coordinates[destination][1]), 2)
			)
		);
	},
};

const { delayBy, resetCounter } = Utils.debounce();

const Traversals = {
	dfs: function (start, destination) {
		visited.add(start);
		delayBy(() => Utils.colorizeElement("node", start, config.nodeActiveColor));
		if (start == destination) return true;
		for (const child of roads[start])
			if (!visited.has(child)) {
				path.add(`${start}-${child}`);
				delayBy(() => Utils.colorizeElement("line", `${start}-${child}`, config.lineActiveColor));
				visited.add(child);
				if (this.dfs(child, destination, visited)) return true;
			}
	},

	bfs: function (start, distination) {
		const queue = [start];
		while (queue.length) {
			const node = queue.shift();
			visited.add(node);
			delayBy(() => Utils.colorizeElement("node", node, config.nodeActiveColor));
			if (node == distination) return true;
			for (const child of roads[node])
				if (!visited.has(child)) {
					path.add(`${node}-${child}`);
					delayBy(
						() => Utils.colorizeElement("line", `${node}-${child}`, config.lineActiveColor),
						1
					);
					visited.add(child);
					queue.push(child);
				}
		}
	},

	astar: function (start, destination) {
		pQueue = new PriorityQueue();
		pQueue.enqueue(start, 0 + Utils.calculateHeuristic(start, destination));
		while (pQueue.items.length) {
			const { node, priority } = pQueue.items.shift();
			visited.add(node);
			delayBy(() => Utils.colorizeElement("node", node, config.nodeActiveColor));
			if (node == destination) return true;
			for (const child of roads[node])
				if (!visited.has(child)) {
					path.add(`${node}-${child}`);
					delayBy(
						() => Utils.colorizeElement("line", `${node}-${child}`, config.lineActiveColor),
						1
					);
					visited.add(child);
					pQueue.enqueue(
						child,
						priority +
						distances[node][child] +
						Utils.calculateHeuristic(child, destination)
					);
				}
		}
	},
};

document.addEventListener("DOMContentLoaded", (event) => {
	const svg = document.getElementById("svg");
	(function draw() {
		for (node in roads) {
			Utils.addNodeCircle(node);
			Utils.addNodeName(node);
		}

		for (node in mapRoads)
			for (child in mapRoads[node]) Utils.addLineBetween(node, mapRoads[node][child]);
	})();

	document.getElementById("form").addEventListener("submit", (e) => {
		const start = document.getElementById("startCities").value;
		const distination = document.getElementById("distCities").value;
		const chosenAlgorithm = document.getElementById("algorithem").value;

		Utils.resetNodesPath();
		visited.clear();
		resetCounter();
		Traversals[chosenAlgorithm](start, distination);

		e.preventDefault();
	});
});
