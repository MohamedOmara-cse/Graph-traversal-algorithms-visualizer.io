let { userNodes, userNodesEdges, SVGNodesPositions, roads, mapRoads, config, distances, Coordinates } = data;
let visited = new Set();
let path = new Set();
let currentTimeoutId;
let previousTimeoutId = 0;
let lineNodesNames = [];
let roadSelection = [];
const algoButtons = document.querySelector("#algorithmBtn");
const messege = document.querySelector("#message");
const { delayBy, resetCounter } = Utils.debounce();

document.addEventListener("DOMContentLoaded", (e) => {

	const resetButton = document.querySelector("#resetButton");

	const algoButtonsContainer = document.querySelector("#algorithmBtn");

	const generateButton = document.getElementById("generateGraph");
	const saveButton = document.querySelector("#saveNodes");
	const userInputNodesDiv = document.querySelector("#userInputNodeDiv");
	let counterOfSelectedNode = 0;

	Utils.corrdinatesProcess();
	//Utils.randomPosition();

	(function draw() {
		Utils.addLineBetween(roads, SVGNodesPositions, svg);
		Utils.addNodeCircleWithName(SVGNodesPositions, svg);
	})();

	Utils.flowMessage(counterOfSelectedNode);

	svg.onclick = svg1Hnadler(e)


	function svg1Hnadler(e) {
		if (e.target.tagName == "circle") {
			let targetNode = e.target.classList.value;
			targetNode = targetNode.split(" ")[0];
			if (counterOfSelectedNode < 2) {
				Utils.colorizeElement("node", targetNode, "select");
				roadSelection[counterOfSelectedNode++] = targetNode;
				Utils.flowMessage(counterOfSelectedNode);
			}
		}
	};

	resetButton.onclick = (e) => {
		for (i in roadSelection) {
			Utils.colorizeElement("node", roadSelection[i], "select");
		}
		roadSelection = [];
		counterOfSelectedNode = 0;
		algoButtonsContainer.classList.remove("deactive");
		Utils.resetNodesPath();
		visited.clear();
		resetCounter();
		isDone = false;
		saveButton.classList.remove("deactiveSave");
	};

	algoButtonsContainer.onclick = (e) => {
		if (e.target.tagName == "BUTTON") {
			const targetAlgorithm = e.target.dataset.algo;
			const start = roadSelection[0];
			const destination = roadSelection[1];

			if (start && destination && targetAlgorithm) {
				algoButtonsContainer.classList.toggle("deactive");
				if (svg.style.display != "none") Traversals[targetAlgorithm](start, destination, roads);
				else Traversals[targetAlgorithm](start, destination, userNodesEdges);
			}
		}
	};

	generateButton.onclick = () => {
		svg.style.display = "none";
		isDone = false;
		userInputNodesDiv.style.display = "block";
		svg2.innerHTML = "";
		document.querySelector("#astarButton").style.display = "none";
		userNodesEdges = {};
		userNodes = {};
		saveButton.classList.remove("deactiveSave");
	};

	let isDone = false;
	Utils.displayLineSelectionIndicator(lineNodesNames.length);
	let ratio = screen.width / (70 * (screen.width < 768 ? 1 : 2));

	svg2.onclick = (e) => {

		let { x: offsetX, y: offsetY } = svg2.getClientRects()[0];
		let nodeRelativePositionX = (e.clientX - offsetX) / ratio;
		let nodeRelativePositionY = (e.clientY - offsetY) / ratio;

		if (e.target.tagName == "circle" || e.target.tagName == "text") {


			const chosenNodeName = Utils.getIdentifierFromEventTarget(e.target);

			if (!isDone) {

				lineNodesNames.push(chosenNodeName);

				Utils.displayLineSelectionIndicator(lineNodesNames.length);

				if (lineNodesNames.length == 2) {
					let [firstNode, secondNode] = lineNodesNames;

					if (firstNode != secondNode) {
						userNodesEdges[secondNode].add(firstNode);
						userNodesEdges[firstNode].add(secondNode);

						Utils.addLineBetween(
							{ [firstNode]: [secondNode] },
							userNodes,
							svg2
						);
					}

					lineNodesNames = [];
					Utils.displayLineSelectionIndicator(lineNodesNames.length);
				}
			} else {
				if (counterOfSelectedNode < 2) {
					Utils.colorizeElement("node", chosenNodeName, "select");
					roadSelection[counterOfSelectedNode++] = chosenNodeName;
					Utils.flowMessage(counterOfSelectedNode);
				}
			}

		} else if (!isDone && e.target.tagName != "text") {
			let keyValue = Object.keys(userNodes).length;
			userNodes[`node${keyValue}`] = { cx: nodeRelativePositionX, cy: nodeRelativePositionY };
			userNodesEdges[`node${keyValue}`] = new Set();
			Utils.addNodeCircleWithName({ [`node${keyValue}`]: userNodes[`node${keyValue}`] }, svg2);
		}
	};

	saveButton.onclick = () => {
		if (isDone != true) {
			isDone = true;
			saveButton.classList.add("deactiveSave");
			svg2.innerHTML = "";
			Utils.addLineBetween(userNodesEdges, userNodes, svg2);
			Utils.addNodeCircleWithName(userNodes, svg2);
		}
	};
	e.preventDefault();
});


svg2.onmousedown = mouseEventsHandler
svg2.onmouseup = mouseEventsHandler

function mouseEventsHandler(e) {
	if (e.target.tagName == "circle" || e.target.tagName == "text") {
		const chosenNodeName = Utils.getIdentifierFromEventTarget(e.target);
		Utils.colorizeElement("node", chosenNodeName, "select");
		console.log(chosenNodeName);
		lineNodesNames.push(chosenNodeName);
		Utils.displayLineSelectionIndicator(lineNodesNames.length);
		if (lineNodesNames.length == 2) {
			let [firstNode, secondNode] = lineNodesNames;
			if (firstNode != secondNode) {
				userNodesEdges[secondNode].add(firstNode);
				userNodesEdges[firstNode].add(secondNode);
				Utils.addLineBetween(
					{ [firstNode]: [secondNode] },
					userNodes,
					svg2
				);
			}
			lineNodesNames = [];
			Utils.displayLineSelectionIndicator(lineNodesNames.length);
		}
	}
}