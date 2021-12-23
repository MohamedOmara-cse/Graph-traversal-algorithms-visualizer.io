let { userNodes, userNodesEdges, SVGNodesPositions, roads, mapRoads, config, distances, Coordinates } = data;
let visited = new Set();
let path = new Set();
let currentTimeoutId;
let previousTimeoutId = 0;
let edgeSelectedNode = [];
let roadSelection = [];
const algoButtons = document.querySelector("#algorithmBtn");
const messege = document.querySelector("#message");
const { delayBy, resetCounter } = Utils.debounce();

document.addEventListener("DOMContentLoaded", (e) => {
	const edgeNodesMesage = document.querySelector("#edgeMessage");
	const resetButton = document.querySelector("#resetButton");
	const svg = document.querySelector("svg");
	const algoButtonsContainer = document.querySelector("#algorithmBtn");
	const generateButton = document.getElementById("generateGraph");
	const svg2 = document.querySelector("#svg2");
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
	svg.onclick = (e) => {
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
		save = false;
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
		save = false;
		userInputNodesDiv.style.display = "block";
		svg2.innerHTML = "";
		document.querySelector("#astarButton").style.display = "none";
		userNodesEdges = {};
		userNodes = {};
		saveButton.classList.remove("deactiveSave");
	};

	let save = false;
	console.log(edgeNodesMesage);
	Utils.edgeNodesMesageFunc(edgeNodesMesage, edgeSelectedNode.length);
	svg2.onclick = (e) => {
		let ratio = screen.width / (70 * (screen.width < 768 ? 1 : 2));
		let x = (e.clientX - e.target.getBoundingClientRect()["x"]) / ratio;
		let y = (e.clientY - e.target.getBoundingClientRect()["y"]) / ratio;

		if (e.target.tagName == "circle") {
			const chosenNode = e.target.classList.value.split(" ")[0];
			if (save == false) {
				edgeSelectedNode.push(chosenNode);
				Utils.edgeNodesMesageFunc(edgeNodesMesage, edgeSelectedNode.length);
				if (edgeSelectedNode.length == 2) {
					if (edgeSelectedNode[0] != edgeSelectedNode[1]) {
						userNodesEdges[edgeSelectedNode[1]].add(edgeSelectedNode[0]);
						userNodesEdges[edgeSelectedNode[0]].add(edgeSelectedNode[1]);

						Utils.addLineBetween(
							{
								[edgeSelectedNode[0]]: [edgeSelectedNode[1]],
							},
							userNodes,
							svg2
						);
					}

					edgeSelectedNode = [];
					Utils.edgeNodesMesageFunc(edgeNodesMesage, edgeSelectedNode.length);
				}
			} else {
				if (counterOfSelectedNode < 2) {
					Utils.colorizeElement("node", chosenNode, "select");
					roadSelection[counterOfSelectedNode++] = chosenNode;
					Utils.flowMessage(counterOfSelectedNode);
				}
			}
		} else if (save == false && e.target.tagName!="text") {
			let keyValue = Object.keys(userNodes).length;
			userNodes[`node${keyValue}`] = { cx: x, cy: y };
			userNodesEdges[`node${keyValue}`] = new Set();
			Utils.addNodeCircleWithName({ [`node${keyValue}`]: userNodes[`node${keyValue}`] }, svg2);
		}
	};

	saveButton.onclick = () => {
		if (save != true) {
			save = true;
			saveButton.classList.add("deactiveSave");
			svg2.innerHTML = "";
			Utils.addLineBetween(userNodesEdges, userNodes, svg2);
			Utils.addNodeCircleWithName(userNodes, svg2);
		}
	};
	e.preventDefault();
});
