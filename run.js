const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require("fs");

const CanvWIDTH = 1680//1400;
const CanvHEIGHT = 850//760;


var blocksObj = {}
var blocksArr = []

var mouseClickPos = {
    "x": 0,
    "y": 0
}

var mousePos = {
    "x": 0,
    "y": 0
}

var cameraOffset = {
    "x": 0,
    "y": 0
};

var rightClicking = false
var isMouseDown = false;

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

c.width = CanvWIDTH;
c.height = CanvHEIGHT;

function log(toLog) {
    console.log(toLog);
    ipcRenderer.send("log-to-logWindow", toLog);
}

function clearLog() {
    ipcRenderer.send("clearLog-to-logWindow", "clear");
}

function addBlock(block) {
    var id = Math.round(Math.random() * 10000).toString();
    if (blocksArr.includes(id)) {
        addBlock(block);
    } else {
        let tempRun = block.run;
        blocksObj[id] = JSON.parse(JSON.stringify(block));
        blocksArr.push(id);
        blocksObj[id].run = tempRun;
        blocksObj[id].pos.x = cameraOffset.x + 10;
        blocksObj[id].pos.y = cameraOffset.y + 10;
        //selectedBlock = blocksObj[id];
    }
}

function loadSave() {
    let data = fs.readFileSync('./save.blc', {encoding:'utf8', flag:'r'});
    data = JSON.parse(data);
    blocksObj = data.blocks;
    blocksArr = data.arr;
    blocksArr.forEach(blockArrNum => {
        let block = blocksObj[blockArrNum];
        block.run = blocks[block.id].run;
    });
}

function save() {
    let data = {
        "blocks": {},
        "arr": [],
    }
    data.blocks = JSON.parse(JSON.stringify(blocksObj));
    data.arr = blocksArr;
    
    fs.writeFile("save.blc", JSON.stringify(data), 'binary', (err)=>{
   if(err) log(err)
   else console.log('File saved')
});
}

function reset() {
    blocksArr = [];
    blocksObj = {};
    addBlock(blocks.startBlock);
}

function connect(block, out, blockToTag, input) {
    if (!blocksObj[blockToTag].inputs[input].taken) {

        if (blocksObj[blockToTag].inputs[input].type == "run") {
            blocksObj[blockToTag].waitForRun = true;
        }
        blocksObj[blockToTag].inputs[input].taken = true;

        block.outputs[out].connections.push({
            "block": blockToTag,
            "node": input
        });
    }
}


let HTML = "";
for (const property in blocks) {
    if (property != "startBlock") {
        HTML += `<button onclick='addBlock(blocks.${property})'>${blocks[property].name}</button>`;
    }
}
document.getElementById("blockChoice").innerHTML = HTML;

addBlock(blocks.startBlock);




startDisplayFile();

//this runs at around 60fps
var tick = setInterval(() => {
    //youll find this in game.js
    updateLogic();

    //youll find this in display.js
    updateScreen();
}, 16);

let canvasElem = document.querySelector("canvas");


canvasElem.addEventListener("mousemove", function (e) {
    let rect = canvasElem.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
});

canvasElem.addEventListener("wheel", function (e) {
    if (e.deltaY < 0) {
        scale += 0.2;
    } else {
        scale -= 0.2;
    }

    setNewScale();
});

canvasElem.addEventListener("mousedown", function (e) {
    isMouseDown = true;
    if (e.which == 3) {
        rightClicking = true;
    }
});

canvasElem.addEventListener("mouseup", function (e) {
    let rect = canvasElem.getBoundingClientRect();
    mouseClickPos.x = e.clientX - rect.left;
    mouseClickPos.y = e.clientY - rect.top;

    rightClicking = false;
    isMouseDown = false;
    draggingBlock = false;
    draggingRope = false;
});

document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowRight") {
        cameraFrameSet.x = 10;
    } else if (event.key == "ArrowLeft") {
        cameraFrameSet.x = -10;
    } else if (event.key == "ArrowUp") {
        cameraFrameSet.y = -10;
    } else if (event.key == "ArrowDown") {
        cameraFrameSet.y = 10;
    }
}, false);

document.addEventListener('keyup', function (event) {
    cameraFrameSet.x = 0;
    cameraFrameSet.y = 0;
}, false);