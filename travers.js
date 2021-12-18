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

		if (!contain) this.items.push(qElement);
	}
}

const Traversals = {
	dfs: function (start, destination) {
		visited.add(start);
		delayBy(() => Utils.colorizeElement("node", start, config.nodeActiveColor));
		if (start == destination) return true;
		for (const child of roads[start])
			if (!visited.has(child)) {
				path.add(`${start}-${child}`);
				delayBy(() => Utils.colorizeElement("line", `${start}-${child}`, config.lineActiveColor));
				visited.add(child);
				if (this.dfs(child, destination, visited)) return true;
			}
	},

	bfs: function (start, distination) {
		const queue = [start];
		while (queue.length) {
			const node = queue.shift();
			visited.add(node);
			delayBy(() => Utils.colorizeElement("node", node, config.nodeActiveColor));
			if (node == distination) return true;
			for (const child of roads[node])
				if (!visited.has(child)) {
					path.add(`${node}-${child}`);
					delayBy(
						() => Utils.colorizeElement("line", `${node}-${child}`, config.lineActiveColor),
						1
					);
					visited.add(child);
					queue.push(child);
				}
		}
	},

	astar: function (start, destination) {
		pQueue = new PriorityQueue();
		pQueue.enqueue(start, 0 + Utils.calculateHeuristic(start, destination));
		while (pQueue.items.length) {
			const { node, priority } = pQueue.items.shift();
			visited.add(node);
			delayBy(() => Utils.colorizeElement("node", node, config.nodeActiveColor));
			if (node == destination) return true;
			for (const child of roads[node])
				if (!visited.has(child)) {
					path.add(`${node}-${child}`);
					delayBy(
						() => Utils.colorizeElement("line", `${node}-${child}`, config.lineActiveColor),
						1
					);
					visited.add(child);
					pQueue.enqueue(
						child,
						priority + distances[node][child] + Utils.calculateHeuristic(child, destination)
					);
				}
		}
	},
};

let roadSelection = [];
const algoButtons = document.querySelector("#algorithmBtn");
const messege = document.querySelector("#message");
