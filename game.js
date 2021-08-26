var selectedBlock;

var draggingBlock = false;
var draggingOffset = { x: 0, y: 0 };

var cameraFrameSet = { "x": 0, "y": 0 };

var draggingRope = false;
var ropeBlockFrom = {};
var outputNum = 0;

function start() {
    startingBlock = blocksObj[blocksArr[0]];
    startingBlock.run(startingBlock);
}

function setNewScale() {
    // blocksArr.forEach(blockArrNum => {
    //     let block = blocksObj[blockArrNum];
    // })
}

function checkInputStates() {
    blocksArr.forEach(arrNum => {
        let block = blocksObj[arrNum];
        if (!block.waitForRun) {
            let anyRead = false;
            block.inputs.forEach(input => {
                if (input.read && input.required) anyRead = true;
            });
            if (!anyRead) {
                block.run(block);
                checkInputStates();
            }
        }
    });
}

function updateLogic() {
    cameraOffset.x += cameraFrameSet.x;
    cameraOffset.y += cameraFrameSet.y;

    if (draggingBlock) {
        selectedBlock.pos.x = mousePos.x - draggingOffset.x - cameraOffset.x;
        selectedBlock.pos.y = mousePos.y - draggingOffset.y - cameraOffset.y;
    } else {

        blocksArr.forEach(arrNum => {
            let block = blocksObj[arrNum];
            if (mousePos.x > block.pos.x - cameraOffset.x && mousePos.x < block.pos.x - cameraOffset.x + blockWidth &&
                mousePos.y > block.pos.y - cameraOffset.y && mousePos.y < block.pos.y - cameraOffset.y + blockHeigt) {

                if (isMouseDown && !draggingRope && !rightClicking) {
                    draggingOffset.x = mousePos.x - block.pos.x - cameraOffset.x;
                    draggingOffset.y = mousePos.y - block.pos.y - cameraOffset.y;
                    selectedBlock = block;
                    draggingBlock = true;

                    let HTML = ""
                    block.inputs.forEach((input, index) => {
                        switch (input.type) {
                            case "value":
                                break;
                            case "run":
                                break;
                            case "text":
                                HTML += `<input id="text${index}" value="${input.value}" placeholder="string here"></input>`
                        }
                    });
                    document.getElementById("selectedBlock").innerHTML = HTML;
                }

            } else {
                block.outputs.forEach((output, index) => {
                    if (mousePos.x > block.pos.x - cameraOffset.x + blockWidth && mousePos.x < block.pos.x - cameraOffset.x + blockWidth + nodeSize &&
                        mousePos.y > block.pos.y - cameraOffset.y + ((index + 1) * blockHeigt) && mousePos.y < block.pos.y - cameraOffset.y + ((index + 2) * blockHeigt)) {
                        if (!draggingRope && isMouseDown && !rightClicking) {
                            outputNum = index;
                            draggingRope = true;
                            ropeBlockFrom = block;
                        } else if (!draggingRope && isMouseDown && rightClicking) {
                            output.connections.forEach(connection => {
                                let tempBlock = blocksObj[connection.block];
                                tempBlock.inputs[connection.node].taken = false;
                            });
                            output.connections = [];
                        }
                    } else if (draggingRope && isMouseDown) {
                        blocksArr.forEach((potBlockArrNum, inputIndex) => {
                            let potBlock = blocksObj[potBlockArrNum];
                            potBlock.inputs.forEach((input, inputIndex) => {
                                if (mousePos.x > potBlock.pos.x - cameraOffset.x - nodeSize && mousePos.x < potBlock.pos.x - cameraOffset.x &&
                                    mousePos.y > potBlock.pos.y - cameraOffset.y + (blockHeigt * inputIndex) && mousePos.y < potBlock.pos.y - cameraOffset.y + blockHeigt * (inputIndex + 1)) {
                                    if (!input.taken && ropeBlockFrom.outputs[outputNum].type == potBlock.inputs[inputIndex].type) {
                                        draggingRope = false;
                                        connect(ropeBlockFrom, outputNum, potBlockArrNum, inputIndex);
                                    }
                                }
                            });
                        });
                    }
                });
            }

            if (!block.waitForRun) {
                let anyRead = false;
                block.inputs.forEach(input => {
                    if (input.read && input.required) anyRead = true;
                });
                if (!anyRead) {
                    block.run(block);
                }
            }
        });
    }

    if (selectedBlock && selectedBlock.inputs.length > 0) {
        selectedBlock.inputs.forEach((input, index) => {
            if (input.type == "text") {
                input.value = document.getElementById(`text${index}`).value;
            }
        });
    }
}