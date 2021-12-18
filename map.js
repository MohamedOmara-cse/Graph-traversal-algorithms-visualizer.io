const { SVGNodesPositions, roads, mapRoads, config, distances, Coordinates } = data;
let visited = new Set();
let path = new Set();
let currentTimeoutId;
let previousTimeoutId = 0;
const { delayBy, resetCounter } = Utils.debounce();

document.addEventListener("DOMContentLoaded", (e) => {
	const resetButton = document.querySelector("#resetButton");
	const svg = document.querySelector("svg");
	const algoButtonsContainer = document.querySelector("#algorithmBtn");

	let counterOfSelectedNode = 0;
	Utils.corrdinatesProcess();
	(function draw() {
		Utils.addLineBetween();
		Utils.addNodeCircleWithName();
	})();

	Utils.flowMessage(counterOfSelectedNode);
	svg.onclick = (e) => {
		if (e.target.tagName == "circle") {
			const targetNode = e.target.classList.value;
			if (counterOfSelectedNode < 2) {
				roadSelection[counterOfSelectedNode++] = targetNode;
				Utils.colorizeElement("line", targetNode, "blue");
				Utils.flowMessage(counterOfSelectedNode);
			}
		}
	};

	resetButton.onclick = (e) => {
		for (i in roadSelection) {
			Utils.colorizeElement(
				"line",
				roadSelection[i],
				config.nodeStrokeColor,
				config.nodeStrokeWidth
			);
		}
		roadSelection = [];
		counterOfSelectedNode = 0;
		algoButtonsContainer.classList.remove("deactive");
		Utils.resetNodesPath();
		visited.clear();
		resetCounter();
	};

	algoButtonsContainer.onclick = (e) => {
		if (e.target.tagName == "BUTTON") {
			const targetAlgorithm = e.target.dataset.algo;
			const start = roadSelection[0];
			const destination = roadSelection[1];
			console.table(start, destination, targetAlgorithm);
			if (start && destination && targetAlgorithm) {
				algoButtonsContainer.classList.toggle("deactive");
				Traversals[targetAlgorithm](start, destination);
			}
		}
	};
	e.preventDefault();
});
