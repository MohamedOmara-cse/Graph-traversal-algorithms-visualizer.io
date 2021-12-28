let activeNodesSet = new Set();
let visited = new Set();
let path = new Set();
let currentTimeoutId;
let previousTimeoutId = 0;
let lineNodesNames = [];
let roadSelection = [];
let userNodeNumber = 0;
const algoButtons = document.querySelector("#algorithmBtn");
const messege = document.querySelector("#message");
let isDone = false;
let ratio = screen.width / (95* (screen.width < 768 ? 1 : 2));
const algoButtonsContainer = document.querySelector("#algorithmBtn");
const resetButton = document.querySelector("#resetButton");
const generateButton = document.getElementById("generateGraph");
const saveButton = document.querySelector("#saveNodes");
const userInputNodesDiv = document.querySelector("#userInputNodeDiv");
let counterOfSelectedNode = 0;

const Utils = {
	colorizeElement: function (type, className, target) {
		const targetElement = document.querySelector(`.${className}`);
		const styleClass = target + type.charAt(0).toUpperCase() + type.slice(1);
		if (target == "active" || target == "select") {
			targetElement.classList.toggle(`${styleClass}`);
			if (styleClass == "activeNode") activeNodesSet.add(className);
			if (styleClass == "activeLine") path.add(className);
		} else {
			targetElement.classList.remove(`active${type.charAt(0).toUpperCase() + type.slice(1)}`);
			targetElement.classList.remove(`select${type.charAt(0).toUpperCase() + type.slice(1)}`);
		}
	},
	userInputGeneration: function (e) {
		let { x: offsetX, y: offsetY } = svg2.getClientRects()[0];
		let nodeRelativePositionX = (e.clientX - offsetX) / ratio;
		let nodeRelativePositionY = (e.clientY - offsetY) / ratio;

		if (e.target.tagName == "circle" || e.target.tagName == "text") {
			const chosenNodeName = Utils.getIdentifierFromEventTarget(e.target);
			console.log(isDone);
			if (!isDone) {
				lineNodesNames.push(chosenNodeName);
				if (lineNodesNames.length > 2) lineNodesNames = [];

				Utils.colorizeElement("node", chosenNodeName, "select");
				if (lineNodesNames.length == 2) {
					let [firstNode, secondNode] = lineNodesNames;

					if (firstNode != secondNode) {
						userNodesEdges[secondNode].add(firstNode);
						userNodesEdges[firstNode].add(secondNode);

						Utils.addLineBetween({ [firstNode]: [secondNode] }, userNodes, svg2);
						Utils.colorizeElement("node", firstNode, "deactive");
						Utils.colorizeElement("node", secondNode, "deactive");
					}

					lineNodesNames = [];
				}
			} else {
				if (counterOfSelectedNode < 2) {
					Utils.colorizeElement("node", chosenNodeName, "select");
					roadSelection[counterOfSelectedNode++] = chosenNodeName;
					Utils.flowMessage(counterOfSelectedNode);
				}
			}
		} else if (!isDone && e.target.tagName != "text") {
			userNodes[`node${userNodeNumber}`] = { cx: nodeRelativePositionX, cy: nodeRelativePositionY };
			userNodesEdges[`node${userNodeNumber}`] = new Set();
			Utils.addNodeCircleWithName({ [`node${userNodeNumber}`]: userNodes[`node${userNodeNumber}`] }, svg2);
			userNodeNumber++;
		}
	},
	selectStartAndDestination: function (e) {
		if (e.target.tagName == "circle") {
			console.log("pressed");
			let targetNode = e.target.classList.value;
			targetNode = targetNode.split(" ")[0];
			if (counterOfSelectedNode < 2) {
				Utils.colorizeElement("node", targetNode, "select");
				roadSelection[counterOfSelectedNode++] = targetNode;
				Utils.flowMessage(counterOfSelectedNode);
			}
		}
	},
	startTraversingGraph: function (e) {
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
	},
	resetPath: function () {
		for (i in roadSelection) {
			Utils.colorizeElement("node", roadSelection[i], "select");
		}
		roadSelection = [];
		lineNodesNames = [];
		counterOfSelectedNode = 0;
		algoButtonsContainer.classList.remove("deactive");
		Utils.resetNodesPath();
		visited.clear();
		resetCounter();
		isDone = false;
		saveButton.classList.remove("deactiveSave");
	},

	generateNewGraph: function () {
		svg.style.display = "none";
		isDone = false;
		userInputNodesDiv.style.display = "block";
		svg2.innerHTML = "";
		document.querySelector("#astarButton").style.display = "none";
		userNodesEdges = {};
		userNodes = {};
		userNodeNumber = 0;
		saveButton.classList.remove("deactiveSave");
	},
	removeNode: function (removedNode) {
		delete userNodes[removedNode];
		userNodesEdges[removedNode].forEach((connectedNode) => {
			userNodesEdges[connectedNode].forEach((child) => {
				if (child == removedNode) userNodesEdges[connectedNode].delete(child);
			});
		});
		delete userNodesEdges[removedNode];
		svg2.innerHTML = "";
		Utils.addLineBetween(userNodesEdges, userNodes, svg2);
		Utils.addNodeCircleWithName(userNodes, svg2);
	},
	displayLineSelectionIndicator: function (n) {
		edgeMessage.innerHTML = `${n} Edge Nodes selected`;
	},

	resetNodesPath: function () {
		for (; previousTimeoutId <= currentTimeoutId; previousTimeoutId++) clearTimeout(previousTimeoutId);
		for (node of activeNodesSet) this.colorizeElement("node", node, "inactive");
		for (line of path) this.colorizeElement("line", line);
		activeNodesSet.clear();
		path.clear();
	},
	corrdinatesProcess: function () {
		Object.keys(data.Coordinates).forEach((node) => {
			data.Coordinates[node] = data.Coordinates[node].map((coordinate) => Math.round((coordinate - 30) * 100));
		});
	},

	flowMessage: function (state) {
		message.innerHTML = config.flowMessage[state];
	},
	debounce: function () {
		let counter = 0;

		function resetCounter() {
			counter = 0;
		}

		function delayBy(callback, delay = 1) {
			counter++;
			currentTimeoutId = setTimeout(() => {
				callback.call();
			}, delay * 1000 * counter);
		}

		return {
			resetCounter,
			delayBy,
		};
	},

	addNodeCircleWithName: function (Nodes, svg) {
		let ratio = screen.width / (95* (screen.width < 768 ? 1 : 2));
		let fragment = document.createDocumentFragment();
		for (let node in Nodes) {
			const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			const name = document.createElementNS("http://www.w3.org/2000/svg", "text");
			const circleData = Nodes[node];
			const circleConfig = {
				class: node,
				cx: circleData.cx * ratio,
				cy: circleData.cy * ratio,
				cursor: "Pointer",
			};
			const svgId = svg.id;
			const nameConfig = {
				svg: { x: circleConfig.cx + 20, y: circleConfig.cy - 7, inner: node },
				svg2: { x: circleConfig.cx - 5 * (node.length - 4), y: circleConfig.cy + 5, inner: node.split("node")[1] },
			};
			name.setAttribute("x", nameConfig[svgId].x);
			name.setAttribute("y", nameConfig[svgId].y);
			name.innerHTML = nameConfig[svgId].inner;

			Object.keys(circleConfig).forEach((attribute) => {
				circle.setAttribute(attribute, circleConfig[attribute]);
			});
			circle.classList.toggle("inactiveNode");
			fragment.appendChild(circle);
			fragment.append(name);
		}

		svg.appendChild(fragment);
	},

	addLineBetween(Edges, Nodes, svg) {
		let ratio = screen.width / (95* (screen.width < 768 ? 1 : 2));
		let fragment = document.createDocumentFragment();
		for (let node in Edges)
			for (let child of Edges[node]) {
				const lineConfig = {
					x1: Nodes[node].cx * ratio,
					x2: Nodes[child].cx * ratio,
					y1: Nodes[node].cy * ratio,
					y2: Nodes[child].cy * ratio,
					class: `${node}-${child} ${child}-${node}`,
				};
				const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
				Object.keys(lineConfig).forEach((attribute) => {
					line.setAttribute(attribute, `${lineConfig[attribute]}`);
				});
				line.classList.toggle("inactiveLine");
				fragment.appendChild(line);
			}

		svg.appendChild(fragment);
	},

	calculateHeuristic(node, destination) {
		return Math.round(
			Math.sqrt(
				Math.pow(Math.abs(Coordinates[node][0] - Coordinates[destination][0]), 2) +
					Math.pow(Math.abs(Coordinates[node][1] - Coordinates[destination][1]), 2)
			)
		);
	},

	getIdentifierFromEventTarget(target) {
		if (target.tagName == "circle") return target.classList.value.split(" ")[0];
		else return "node" + target.innerHTML;
	},

	/*	randomPosition: () => {
		console.log(SVGNodesPositions);
		for (node in SVGNodesPositions) {
		
			console.log(SVGNodesPositions[node]["cx"]);
			SVGNodesPositions[node]["cx"] = Math.floor(Math.random() * 100);
			SVGNodesPositions[node]["cy"] = Math.floor(Math.random() * 50 );
		}
	},
	*/
};
