let data = {
	userNodes: {},
	userNodesEdges: {},
	SVGNodesPositions: {
		shibin: { cx: 15 + 32, cy: 5 + 25 },
		sirs: { cx: 15 + 25, cy: 5 + 3 },
		menouf: { cx: 15 + 5, cy: 5 + 5 },
		elbagour: { cx: 15 + 37.5, cy: 5 + 7.5 },
		elsadat: { cx: 15 + 15, cy: 5 + 40 },
		ashmon: { cx: 15 + 45, cy: 5 + 25 },
		shohada: { cx: 15 + 25, cy: 5 + 47.5 },
		quesna: { cx: 15 + 3, cy: 5 + 25 },
		tala: { cx: 15 + 45, cy: 5 + 15 },
		berket: { cx: 15 + 45, cy: 5 + 45 },
		shobra: { cx: 15 + 60, cy: 5 + 15 },
		sabk: { cx: 15 + 60, cy: 5 + 35 },
		shanwan: { cx: 15 + 60, cy: 5 + 25 },
	},

	config: {
		nodeActiveColor: "#40469d",
		nodeStrokeColor: "green",
		nodeStrokeWidth: "2px",
		activeStrokeWidth: "5px",
		nodeRadius: "10px",
		nodeFillColor: "yellow",
		nodeInactiveColor: "yellow",
		lineActiveColor: "blue",
		lineInActiveColor: "black",
		lineWidth: "2px",
		disableAlgoButtons: "gray",
		enableAlgoButton: "#000000",
		flowMessage: [
			"Choose the start Node",
			"Now choose the Destination node",
			"Finally hit the algorithm you need and stay focused",
		],
	},

	roads: {
		shibin: ["shohada", "menouf", "tala", "elbagour", "berket", "ashmon", "quesna", "elsadat"],
		sirs: ["menouf", "elbagour"],
		menouf: ["sirs", "shibin", "elsadat"],
		elbagour: ["shibin", "sirs", "shobra"],
		elsadat: ["shibin", "menouf"],
		ashmon: ["shibin", "shobra", "sabk", "shanwan"],
		shohada: ["shibin"],
		quesna: ["shibin"],
		tala: ["shibin", "shobra"],
		berket: ["shibin", "sabk"],
		shobra: ["ashmon", "elbagour", "tala", "shanwan"],
		sabk: ["berket", "ashmon", "shanwan"],
		shanwan: ["shobra", "sabk", "ashmon"],
	},

	mapRoads: {
		shibin: ["menouf", "tala", "elbagour", "shohada", "elsadat", "berket", "ashmon", "quesna"],
		sirs: ["menouf", "elbagour"],
		elsadat: ["menouf"],
		ashmon: ["shobra", "sabk", "shanwan"],
		berket: ["sabk"],
		shobra: ["tala", "elbagour"],
		shanwan: ["shobra", "sabk"],
	},

	distances: {
		shibin: {
			tala: 18,
			shohada: 16.5,
			menouf: 16.4,
			elbagour: 14.6,
			quesna: 18.7,
			berket: 14,
			ashmon: 42.2,
			elsadat: 61.4,
		},
		sirs: { menouf: 4.2, elbagour: 7.1 },
		menouf: { sirs: 4.2, shibin: 16.1, elsadat: 55.9 },
		tala: { shibin: 18, shobra: 20 },
		berket: { shibin: 14, sabk: 22 },
		elbagour: { shibin: 14.9, sirs: 7.1, shobra: 27 },
		ashmon: { shibin: 42.2, shobra: 19, shanwan: 33, sabk: 24 },
		quesna: { shibin: 18.1 },
		elsadat: { shibin: 61.4, menouf: 54.5 },
		shohada: { shibin: 17.5 },
		shobra: { ashmon: 19, elbagour: 27, tala: 20, shanwan: 11 },
		sabk: { berket: 22, ashmon: 24, shanwan: 23 },
		shanwan: { shobra: 11, sabk: 23, ashmon: 33 },
	},

	Coordinates: {
		shibin: [30.55492, 31.01239],
		sirs: [30.4427159, 30.96665],
		menouf: [30.4584, 30.93386],
		tala: [30.68312, 30.95003],
		berket: [30.62749, 31.0724],
		elbagour: [30.4318, 31.03198],
		ashmon: [30.30011, 30.9756],
		quesna: [30.5676, 31.14956],
		elsadat: [30.36281, 30.53315],
		shohada: [30.5976, 30.89575],
		shanwan: [31.555, 31.345634],
		shobra: [31.123546, 31.6754],
		sabk: [31.4564, 31.7654],
	},
};
