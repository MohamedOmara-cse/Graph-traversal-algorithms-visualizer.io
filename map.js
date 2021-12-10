const data = {

	config: {
		nodeActiveColor: "red",
		nodeInactiveColor: "yellow",
		lineActiveColor: "gray",
		lineInActiveColor: "black",
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
		shibin: { tala: 18, shohada: 16.5, menouf: 16.4, elbagour: 14.6, quesna: 18.7, berket: 14, ashmon: 42.2, elsadat: 61.4 },
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
	}

}

Object.keys(data.Coordinates).forEach(node => {
	data.Coordinates[node] = data.Coordinates[node].map(coordinate => Math.round((coordinate - 30) * 100));
})

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

		if (!contain) {
			this.items.push(qElement);
		}
	}

}

const { roads, mapRoads, config, distances, Coordinates } = data;
let visited = new Set();
let timeout;

const Utils = {

	colorizeNode: function (id, color) {
		document.querySelector(`#${id}`).style.fill = color;
	},

	resetNodes: function () {
		for (let i = 0; i < timeout; i++) clearTimeout(i);
		for (node of visited) this.colorizeNode(node, config.nodeInactiveColor);
	},

	debounce: function () {
		let counter = 0;

		function resetCounter() {
			counter = 0;
		}

		function delayBy(callback, delay) {
			counter++;
			timeout = setTimeout(() => {
				callback();
			}, delay * 1000 * counter);
		};

		return {
			resetCounter,
			delayBy
		}
	},

	addNodeName(text) {
		const x = document.getElementById(`${text}`).cx.animVal.value;
		const y = document.getElementById(`${text}`).cy.animVal.value;
		const name = document.createElementNS("http://www.w3.org/2000/svg", "text");
		name.setAttribute("x", `${x + 10}`);
		name.setAttribute("y", `${y + 15}`);
		name.innerHTML = text;
		svg.appendChild(name);
	},

	addLineBetween(start, distination) {

		const lineConfig = {
			x1: document.getElementById(`${start}`).cx.animVal.value,
			x2: document.getElementById(`${distination}`).cx.animVal.value,
			y1: document.getElementById(`${start}`).cy.animVal.value,
			y2: document.getElementById(`${distination}`).cy.animVal.value,
			stroke: "black",
			strokeWidth: "1px",
		};

		const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

		Object.keys(lineConfig).forEach((attribute) => {
			line.setAttribute(attribute, `${lineConfig[attribute]}`);
		});

		svg.appendChild(line);
	},

	calculateHeuristic(node, destination) {

		return Math.round(Math.sqrt(
			Math.pow(Math.abs(Coordinates[node][0] - Coordinates[destination][0]), 2) +
			Math.pow(Math.abs(Coordinates[node][1] - Coordinates[destination][1]), 2)
		));
	}
}

const { delayBy, resetCounter } = Utils.debounce();

const Traversals = {

	dfs: function (start, distination) {
		visited.add(start);
		delayBy(() => Utils.colorizeNode(start, config.nodeActiveColor), 1);
		if (start == distination) return true;
		for (const child of roads[start])
			if (!visited.has(child)) {
				visited.add(child);
				if (this.dfs(child, distination, visited)) return true;
			}
	},

	bfs: function (start, distination) {
		const queue = [start];
		while (queue.length) {
			const node = queue.shift();
			visited.add(node);
			delayBy(() => Utils.colorizeNode(node, config.nodeActiveColor), 1);
			if (node == distination) return true;
			for (const child of roads[node])
				if (!visited.has(child)) {
					visited.add(child);
					queue.push(child);
				}
		}
	},

	astar: function (start, destination) {
		pQueue = new PriorityQueue();
		pQueue.enqueue(start, distances[start][destination] + Utils.calculateHeuristic(start, destination));
		while (pQueue.items.length) {
			const { node, priority } = pQueue.items.shift();
			visited.add(node);
			delayBy(() => Utils.colorizeNode(node, config.nodeActiveColor), 1);
			if (node == destination) return true;
			for (const child of roads[node])
				if (!visited.has(child)) {
					visited.add(child);
					pQueue.enqueue(child, distances[node][child] + Utils.calculateHeuristic(child, destination));
					console.table(pQueue.items);
				}
		}
	}
}

document.addEventListener("DOMContentLoaded", (event) => {

	const svg = document.getElementById("svg");

	(function draw() {
		for (node in roads) Utils.addNodeName(node);

		for (node in mapRoads)
			for (child in mapRoads[node])
				Utils.addLineBetween(node, mapRoads[node][child]);

	})();

	document.getElementById("form").addEventListener("submit", (e) => {
		const start = document.getElementById("startCities").value;
		const distination = document.getElementById("distCities").value;
		const chosenAlgorithm = document.getElementById("algorithem").value;

		Utils.resetNodes();
		visited.clear();
		resetCounter();
		Traversals[chosenAlgorithm](start, distination)

		e.preventDefault();
	});
});
