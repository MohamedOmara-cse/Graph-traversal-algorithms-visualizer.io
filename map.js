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
}

const { roads, mapRoads, config } = data;
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
	}
}

document.addEventListener("DOMContentLoaded", (event) => {

	const svg = document.getElementById("svg");

	(function draw() {
		for (node in roads) {
			const x = document.getElementById(`${node}`).cx.animVal.value;
			const y = document.getElementById(`${node}`).cy.animVal.value;
			const name = document.createElementNS("http://www.w3.org/2000/svg", "text");
			name.setAttribute("x", `${x + 10}`);
			name.setAttribute("y", `${y + 15}`);
			name.innerHTML = node;
			svg.appendChild(name);
		}
		for (i in mapRoads) {
			const Start = document.getElementById(`${i}`);
			const xStart = Start.cx.animVal.value;
			const yStart = Start.cy.animVal.value;

			for (j in mapRoads[i]) {
				const Dist = document.getElementById(`${mapRoads[i][j]}`);
				const xDist = Dist.cx.animVal.value;
				const yDist = Dist.cy.animVal.value;

				const lineConfig = {
					x1: xStart,
					x2: xDist,
					y1: yStart,
					y2: yDist,
					stroke: "black",
					strokeWidth: "1px",
				};

				const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

				Object.keys(lineConfig).forEach((attribute) => {
					line.setAttribute(attribute, `${lineConfig[attribute]}`);
				});

				svg.appendChild(line);
			}
		}
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
