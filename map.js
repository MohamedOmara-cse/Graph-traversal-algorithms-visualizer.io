document.addEventListener("DOMContentLoaded", (event) => {
	let visited = new Set();

	const config = {
		nodeActiveColor: "red",
		nodeInactiveColor: "yellow",
		lineActiveColor: "gray",
		lineInActiveColor: "black",
	};

	const roads = {
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
	};

	const mapRoads = {
		shibin: ["menouf", "tala", "elbagour", "shohada", "elsadat", "berket", "ashmon", "quesna"],
		sirs: ["menouf", "elbagour"],
		elsadat: ["menouf"],
	};

	const svg = document.getElementById("svg");

	(function draw() {
		for (s in roads) {
			const x = document.getElementById(`${s}`).cx.animVal.value;
			const y = document.getElementById(`${s}`).cy.animVal.value;
			const name = document.createElementNS("http://www.w3.org/2000/svg", "text");
			name.setAttribute("x", `${x + 10}`);
			name.setAttribute("y", `${y + 15}`);
			name.innerHTML = s;
			svg.appendChild(name);
		}
		for (i in mapRoads) {
			const xStart = document.getElementById(`${i}`).cx.animVal.value;
			const yStart = document.getElementById(`${i}`).cy.animVal.value;

			for (j in mapRoads[i]) {
				const xDist = document.getElementById(`${mapRoads[i][j]}`).cx.animVal.value;
				const yDist = document.getElementById(`${mapRoads[i][j]}`).cy.animVal.value;
				const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

				line.setAttribute("x1", `${xStart}`);
				line.setAttribute("y1", `${yStart}`);
				line.setAttribute("x2", `${xDist}`);
				line.setAttribute("y2", `${yDist}`);
				line.setAttribute("stroke", "black");
				line.setAttribute("stroke-width", "2px");
				svg.appendChild(line);
			}
		}
	})();

	function dfs(start, distination) {
		visited.add(start);
		delayBy(() => colorizeNode(start, undefined, config.nodeActiveColor), 1);
		if (start == distination) return true;
		for (const child of roads[start])
			if (!visited.has(child)) {
				visited.add(child);
				if (dfs(child, distination, visited)) return true;
			}
	}

	function bfs(start, destination) {
		let queue = [];

		queue.push(start);
		visited.add(start);
		delayBy(() => colorizeNode(start, undefined, config.nodeActiveColor), 1);

		while (queue.length != 0) {
			let node = queue.shift();
			if (start == destination) return true;
			for (const child of roads[node])
				if (!visited.has(child)) {
					visited.add(child);
					delayBy(() => colorizeNode(child, undefined, config.nodeActiveColor), 1);

					if (child == destination) return;
					else queue.push(child);
				}
		}
	}

	function colorizeNode(id, prop = "fill", color) {
		document.querySelector(`#${id}`).style[prop] = color;
	}
	let timeout;
	function debounce() {
		let counter = 0;
		return function (func, delay) {
			counter++;
			timeout = setTimeout(() => {
				func();
			}, delay * 1000 * counter);
		};
	}

	let delayBy;

	function deColorizeNode() {
    let i=0;
		while(i <=timeout){
    clearTimeout(i);
    i++
    }
		for (node of visited) {
			document.querySelector(`#${node}`).style["fill"] = config.nodeInactiveColor;
		}
	}

	document.getElementById("form").addEventListener("submit", (e) => {
		const start = document.getElementById("startCities").value;
		const distination = document.getElementById("distCities").value;
		const chosenAlgorithm = document.getElementById("algorithem").value;
		delayBy = debounce();
		console.log(visited);
		deColorizeNode();
		visited.clear();

		switch (chosenAlgorithm) {
			case "dfs":
				dfs(start, distination);
				break;
			case "bfs":
				bfs(start, distination);
				break;
		}

		e.preventDefault();
	});
});
