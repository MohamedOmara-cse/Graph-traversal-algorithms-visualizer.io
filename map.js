let { userNodes, userNodesEdges, SVGNodesPositions, roads, mapRoads, config, distances, Coordinates } = data;
const { delayBy, resetCounter } = Utils.debounce();
document.addEventListener("DOMContentLoaded", (e) => {
	Utils.corrdinatesProcess();
	(function draw() {
		Utils.addLineBetween(roads, SVGNodesPositions, svg);
		Utils.addNodeCircleWithName(SVGNodesPositions, svg);
	})();
	Utils.flowMessage(counterOfSelectedNode);
	svg.onclick = Utils.selectStartAndDestination;
	resetButton.onclick = Utils.resetPath;
	algoButtonsContainer.onclick = Utils.startTraversingGraph;
	
	generateButton.onclick = Utils.generateNewGraph;
	Utils.displayLineSelectionIndicator(lineNodesNames.length);
	svg2.onclick = Utils.userInputGeneration;

	saveButton.onclick = () => {	
			isDone = true;
			saveButton.classList.add("deactiveSave");
			svg2.innerHTML = "";
			Utils.addLineBetween(userNodesEdges, userNodes, svg2);
			Utils.addNodeCircleWithName(userNodes, svg2);
	};

	svg2.ondblclick = (e) => {
		if (e.target.tagName == "circle" || e.target.tagName == "text") {
			console.log("dblclick");
			const removedNodeName = Utils.getIdentifierFromEventTarget(e.target);

			Utils.removeNode(removedNodeName);
		}
	};
	e.preventDefault();
});

/*
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
*/
