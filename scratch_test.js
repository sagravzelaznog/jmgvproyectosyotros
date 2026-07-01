const fs = require('fs');

const width = 10;
const height = 10;
const edgeMap = new Uint8Array(width * height);
const visited = new Uint8Array(width * height);

// Create a simple line from (2,2) to (7,7)
for (let i = 2; i <= 7; i++) {
    edgeMap[i * width + i] = 1;
}

let dxfData = "";

const dirs = [
    {dx: 1, dy: 0}, {dx: 1, dy: 1}, {dx: 0, dy: 1}, {dx: -1, dy: 1},
    {dx: -1, dy: 0}, {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1}
];

const dirs2 = [
    {dx: 2, dy: 0}, {dx: 2, dy: 1}, {dx: 2, dy: 2}, {dx: 1, dy: 2},
    {dx: 0, dy: 2}, {dx: -1, dy: 2}, {dx: -2, dy: 2}, {dx: -2, dy: 1},
    {dx: -2, dy: 0}, {dx: -2, dy: -1}, {dx: -2, dy: -2}, {dx: -1, dy: -2},
    {dx: 0, dy: -2}, {dx: 1, dy: -2}, {dx: 2, dy: -2}, {dx: 2, dy: -1}
];

let polylines = [];

for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
        let idx = y * width + x;
        if (edgeMap[idx] === 1 && visited[idx] === 0) {
            let polyline = [{x: x, y: y}];
            visited[idx] = 1;
            
            let currX = x;
            let currY = y;
            while (true) {
                let foundNext = false;
                for (let d = 0; d < dirs.length; d++) {
                    let nx = currX + dirs[d].dx;
                    let ny = currY + dirs[d].dy;
                    let nIdx = ny * width + nx;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        if (edgeMap[nIdx] === 1 && visited[nIdx] === 0) {
                            currX = nx;
                            currY = ny;
                            polyline.push({x: currX, y: currY});
                            visited[nIdx] = 1;
                            foundNext = true;
                            break;
                        }
                    }
                }
                if (!foundNext) break;
            }
            
            currX = x;
            currY = y;
            while (true) {
                let foundNext = false;
                for (let d = 0; d < dirs.length; d++) {
                    let nx = currX + dirs[d].dx;
                    let ny = currY + dirs[d].dy;
                    let nIdx = ny * width + nx;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        if (edgeMap[nIdx] === 1 && visited[nIdx] === 0) {
                            currX = nx;
                            currY = ny;
                            polyline.unshift({x: currX, y: currY});
                            visited[nIdx] = 1;
                            foundNext = true;
                            break;
                        }
                    }
                }
                if (!foundNext) break;
            }
            
            if (polyline.length > 1) {
                polylines.push(polyline);
            }
        }
    }
}

console.log("Found", polylines.length, "polylines");
for(let p of polylines) {
    console.log("Polyline of length", p.length);
    console.log(p);
}
