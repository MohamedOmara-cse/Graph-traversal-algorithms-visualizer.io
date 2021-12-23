let activeNodesSet = new Set();
const Utils = {
	colorizeElement: function (type, className, target) {
		const targetElement = document.querySelector(`.${className}`);
		if (type == "node")
			if (target == "select") targetElement.classList.toggle("selectNode");
			else if (target == "active") {
				activeNodesSet.add(className);
				targetElement.classList.toggle("activeNode");
			} else {
				targetElement.classList.remove("selectNode");
				targetElement.classList.remove("activeNode");
			}
		else {
			if (target == "active") {
				targetElement.classList.toggle("activeLine");
				path.add(className);
			} else targetElement.classList.toggle("activeLine");
		}
	},

	displayLineSelectionIndicator: function (n) {
		edgeMessage.innerHTML = `${n} Edge Nodes selected`;
	},

	resetNodesPath: function () {
		console.table(activeNodesSet, path);
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
		let ratio = screen.width / (70 * (screen.width < 768 ? 1 : 2));
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
			if (svg.id == "svg2") {
				name.innerHTML = node.split("node")[1];
				name.setAttribute("x", circleConfig.cx - 5 * (node.length - 4));
				name.setAttribute("y", circleConfig.cy + 5);
				name.style.fontWeight = "bold";
				name.style.cursor = "pointer";
			} else {
				name.innerHTML = node;
				name.setAttribute("x", circleConfig.cx + 25);
				name.setAttribute("y", circleConfig.cy + -7);
			}
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
		let ratio = screen.width / (70 * (screen.width < 768 ? 1 : 2));
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
		else return 'node' + target.innerHTML;
	}


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
