document.addEventListener("DOMContentLoaded", (event) => {
  let reachedDistination = false;
  let visited = new Set();

  const config = {
    nodeActiveColor: "blue",
    nodeInactiveColor: "yellow",
    lineActiveColor: "gray",
    lineInActiveColor: "black",
  };

  const roads = {
    shibin: [
      "elshohada",
      "menouf",
      "tala",
      "elbagour",
      "berket",
      "ashmon",
      "quesna",
      "elsadat",
    ],
    sirs: ["menouf", "elbagour"],
    menouf: ["sirs", "shibin", "elsadat"],
    elbagour: ["shibin", "sirs"],
    elsadat: ["shibin", "menouf"],
    ashmon: ["shibin"],
    elshohada: ["shibin"],
    quesna: ["shibin"],
    tala: ["shibin"],
    berket: ["shibin"],
  };

  const mapRoads = {
    shibin: [
      "menouf",
      "tala",
      "elbagour",
      "elshohada",
      "elsadat",
      "berket",
      "ashmon",
      "quesna",
    ],
    sirs: ["menouf", "elbagour"],
    elsadat: ["menouf"],
  };

  const svg = document.getElementById("svg");

  (function draw() {
    for (s in roads) {
      const x = document.getElementById(`${s}`).cx.animVal.value;
      const y = document.getElementById(`${s}`).cy.animVal.value;
      const name = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      name.setAttribute("x", `${x + 50}`);
      name.setAttribute("y", `${y + 50}`);
      name.innerHTML = s;
      svg.appendChild(name);
    }
    for (i in mapRoads) {
      const xStart = document.getElementById(`${i}`).cx.animVal.value;
      const yStart = document.getElementById(`${i}`).cy.animVal.value;

      for (j in mapRoads[i]) {
        const xDist = document.getElementById(`${mapRoads[i][j]}`).cx.animVal
          .value;
        const yDist = document.getElementById(`${mapRoads[i][j]}`).cy.animVal
          .value;
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );

        line.setAttribute("x1", `${xStart}`);
        line.setAttribute("y1", `${yStart}`);
        line.setAttribute("x2", `${xDist}`);
        line.setAttribute("y2", `${yDist}`);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "5px");
        svg.appendChild(line);
      }
    }
  })();

  function dfs(start, distination) {
    console.log(start);
    visited.add(start);
    delayBy(() => {
      colorizeNode(start, config.nodeActiveColor);
    }, 1);

    if (start == distination) return true;

    for (const child of roads[start]) {
      if (visited.has(child)) continue;
      else {
        visited.add(child);
        if (dfs(child, distination, visited)) return true;
      }
    }
  }

  function bfs(start, distination) {
    let queue = [];

    queue.push(start);
    visited.add(start);
    colorizeNode(child, config.nodeActiveColor);

    while (queue.length != 0) {
      let node = queue.shift();

      if (start == distination) {
        reachedDistination = true;

        break;
      }
      if (reachedDistination) {
        break;
      }
      for (const child of roads[node]) {
        if (!visited.has(child)) {
          visited.add(child);
          queue.push(child);
        }

        if (child == distination) {
          reachedDistination = true;
          break;
        }
      }
    }
    return visited;
  }

  function colorizeNode(id, color) {
    document.querySelector(`#${id}`).style.fill = color;
  }

  function debounce() {
    let counter = 0;

    return function (func, delay) {
      counter++;

      setTimeout(() => {
        func();
      }, delay * 1000 * counter);
    };
  }

  const delayBy = debounce();

  document.getElementById("form").addEventListener("submit", (e) => {
    //Getting the form values on submit
    const start = document.getElementById("startCities").value;
    const distination = document.getElementById("distCities").value;
    const chosenAlgorithm = document.getElementById("algorithem").value;
    visited.clear();

    reachedDistination = 0;

    switch (chosenAlgorithm) {
      case "dfs":
        dfs(start, distination);
        break;
      case "bfs":
        bfs(start, distination);
        break;
      default:
        break;
    }

    e.preventDefault();
  });
});
