interface Node {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
  parent: Node | null;
}

export function astar(start: [number, number], end: [number, number], grid: boolean[][]): [number, number][] {
  const openSet: Node[] = [];
  const closedSet: Node[] = [];
  const startNode: Node = { x: start[0], y: start[1], f: 0, g: 0, h: 0, parent: null };
  
  openSet.push(startNode);

  while (openSet.length > 0) {
    let currentNode = openSet[0];
    let currentIndex = 0;

    // Find node with lowest f value
    openSet.forEach((node, index) => {
      if (node.f < currentNode.f) {
        currentNode = node;
        currentIndex = index;
      }
    });

    // Remove current node from openSet and add to closedSet
    openSet.splice(currentIndex, 1);
    closedSet.push(currentNode);

    // Found the goal
    if (currentNode.x === end[0] && currentNode.y === end[1]) {
      const path: [number, number][] = [];
      let current: Node | null = currentNode;
      while (current) {
        path.push([current.x, current.y]);
        current = current.parent;
      }
      return path.reverse();
    }

    // Generate neighbors
    const neighbors: Node[] = [];
    for (let newX = -1; newX <= 1; newX++) {
      for (let newY = -1; newY <= 1; newY++) {
        if (newX === 0 && newY === 0) continue;

        const neighborX = currentNode.x + newX;
        const neighborY = currentNode.y + newY;

        if (
          neighborX >= 0 && neighborX < grid.length &&
          neighborY >= 0 && neighborY < grid[0].length &&
          !grid[neighborX][neighborY]
        ) {
          neighbors.push({
            x: neighborX,
            y: neighborY,
            f: 0,
            g: 0,
            h: 0,
            parent: currentNode
          });
        }
      }
    }

    for (const neighbor of neighbors) {
      if (closedSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
        continue;
      }

      neighbor.g = currentNode.g + 1;
      neighbor.h = Math.abs(neighbor.x - end[0]) + Math.abs(neighbor.y - end[1]);
      neighbor.f = neighbor.g + neighbor.h;

      if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
        openSet.push(neighbor);
      }
    }
  }

  return [];
}