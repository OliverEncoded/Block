const { contextBridge } = require("electron");

var scale = 0.8;

var blockWidth = scale;
var blockHeigt = scale;
var textSize = scale;
var nodeSize = scale;
var spaceSize = scale;
var lineWidth = scale;

function startDisplayFile() {
    ctx = c.getContext("2d");
}


function updateScreen() {
    ctx.clearRect(0, 0, CanvWIDTH, CanvHEIGHT);

    blockWidth = 200 * scale;
    blockHeigt = 40 * scale;
    textSize = 15 * scale;
    nodeSize = 20 * scale;
    spaceSize = 20 * scale;
    lineWidth = 5 * scale;

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, CanvWIDTH, CanvWIDTH)


    blocksArr.forEach(blockNum => {
        block = blocksObj[blockNum];
        block.outputs.forEach((output, index) => {
            output.connections.forEach(connection => {

                ctx.strokeStyle = "grey";
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(block.pos.x - cameraOffset.x + blockWidth + nodeSize / 2, block.pos.y - cameraOffset.y + ((index + 1) * blockHeigt) + blockHeigt / 2);
                let blockTo = blocksObj[connection.block];
                ctx.lineTo(blockTo.pos.x - cameraOffset.x - nodeSize / 2, blockTo.pos.y - cameraOffset.y + ((connection.node + 1) * blockHeigt) - blockHeigt / 2);
                ctx.stroke();


            });
        });
    });

    if (draggingRope) {
        ctx.strokeStyle = "grey";
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ropeBlockFrom.pos.x - cameraOffset.x + blockWidth + nodeSize / 2, ropeBlockFrom.pos.y - cameraOffset.y + ((outputNum + 1) * blockHeigt) + blockHeigt / 2);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
    }

    blocksArr.forEach((e, arrIndex) => {
        var block = blocksObj[blocksArr[arrIndex]];

        var largestSide = 1;
        if (block.outputs.length > largestSide) largestSide = block.outputs.length;
        if (block.inputs.length  > largestSide) largestSide = block.inputs.length - 1;

        //create title box
        ctx.fillStyle = "blue";
        if (block == selectedBlock) ctx.fillStyle = "green";
        ctx.fillRect(block.pos.x - cameraOffset.x, block.pos.y - cameraOffset.y, blockWidth, blockHeigt);

        //create body
        ctx.fillStyle = "white";
        ctx.fillRect(block.pos.x - cameraOffset.x, block.pos.y - cameraOffset.y + blockHeigt, blockWidth, largestSide * blockHeigt);

        //setting the font size and making it monospaced
        ctx.font = `${textSize}px monospace`;

        //adding title
        ctx.fillText(block.name, block.pos.x - cameraOffset.x + spaceSize, block.pos.y - cameraOffset.y + blockHeigt - blockHeigt / 2 + textSize / 4);


        block.outputs.forEach((output, index) => {
            //making the text black and putting it on the right side
            ctx.fillStyle = "black";
            ctx.fillText(output.name, block.pos.x -cameraOffset.x + blockWidth - (output.name.length * ((textSize / 5)) * 3) - spaceSize, block.pos.y - cameraOffset.y + ((index + 2) * blockHeigt) - blockHeigt / 2 + textSize / 4);

            ctx.fillStyle = "yellow";
            if (output.type == "run") ctx.fillStyle = "red";
            ctx.fillRect(block.pos.x - cameraOffset.x + blockWidth, block.pos.y - cameraOffset.y + (index + 1) * blockHeigt + blockHeigt / 2 - nodeSize / 2, nodeSize, nodeSize);
        });

        block.inputs.forEach((input, index) => {
            //making the text black and putting it on the left side
            ctx.fillStyle = "black";
            ctx.fillText(input.name, block.pos.x - cameraOffset.x + spaceSize, block.pos.y - cameraOffset.y + ((index + 1) * blockHeigt) - blockHeigt / 2 + textSize / 4);

            if (input.type == "value" || input.type == "run") {

                ctx.fillStyle = "yellow";
                if(input.type == "run") ctx.fillStyle = "red";
                ctx.fillRect(block.pos.x - cameraOffset.x - nodeSize, block.pos.y - cameraOffset.y + blockHeigt*index + (blockHeigt / 2 - nodeSize / 2), nodeSize, nodeSize);
            }
        });
    });



}