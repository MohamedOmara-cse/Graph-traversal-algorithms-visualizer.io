const Utils = {
	colorizeElement: function (type, className, color, strokehWidth = config.activeStrokeWidth) {
		let elementProp = {
			node: "fill",
			line: "stroke",
		};
		document.querySelector(`.${className}`).style[elementProp[type]] = color;
		document.querySelector(`.${className}`).style["stroke-width"] = strokehWidth;
	},
	corrdinatesProcess: function () {
		Object.keys(data.Coordinates).forEach((node) => {
			data.Coordinates[node] = data.Coordinates[node].map((coordinate) =>
				Math.round((coordinate - 30) * 100)
			);
		});
	},
	resetNodesPath: function () {
		for (; previousTimeoutId <= currentTimeoutId; previousTimeoutId++)
			clearTimeout(previousTimeoutId);
		for (node of visited)
			this.colorizeElement("node", node, config.nodeInactiveColor, config.nodeStrokeWidth);
		for (line of path)
			this.colorizeElement("line", line, config.lineInActiveColor, config.nodeStrokeWidth);
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

	addNodeCircleWithName() {
		let ratio = screen.width / (70 * (screen.width < 768 ? 1 : 2));
		let fragment = document.createDocumentFragment();
		for (node in roads) {
			const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			const name = document.createElementNS("http://www.w3.org/2000/svg", "text");

			const circleData = SVGNodesPositions[node];
			const circleConfig = {
				class: node,
				cx: circleData.cx * ratio,
				cy: circleData.cy * ratio,
				r: config.nodeRadius,
				fill: config.nodeInactiveColor,
				stroke: config.nodeStrokeColor,
				"stroke-width": config.nodeStrokeWidth,
				cursor: "Pointer",
			};
			name.setAttribute("x", circleConfig.cx + 25);
			name.setAttribute("y", circleConfig.cy + -7);
			name.innerHTML = node;
			Object.keys(circleConfig).forEach((attribute) => {
				circle.setAttribute(attribute, circleConfig[attribute]);
			});

			fragment.appendChild(circle);
			fragment.append(name);
		}
		svg.appendChild(fragment);
	},

	addLineBetween() {
		let ratio = screen.width / (70 * (screen.width < 768 ? 1 : 2));
		let fragment = document.createDocumentFragment();
		for (node in mapRoads)
			for (child of mapRoads[node]) {
			
				const lineConfig = {
					x1: SVGNodesPositions[node].cx * ratio,
					x2: SVGNodesPositions[child].cx * ratio,
					y1: SVGNodesPositions[node].cy * ratio,
					y2: SVGNodesPositions[child].cy * ratio,
					class: `${node}-${child} ${child}-${node}`,
					stroke: config.lineInActiveColor,
					"stroke-width": config.lineWidth,
				};

				const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

				Object.keys(lineConfig).forEach((attribute) => {
					line.setAttribute(attribute, `${lineConfig[attribute]}`);
				});

				
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
};
