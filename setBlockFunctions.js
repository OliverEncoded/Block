const Dialogs = require('dialogs')
const dialogs = Dialogs();
let blocks = require("./blocks.json");
blocks = JSON.parse(JSON.stringify(blocks));

console.log("starting")

//start block
blocks.startBlock.run = async (block) => {
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].run(blocksObj[connection.block]);
    });
}

//log block
blocks.logBlock.run = async (block) => {
    log(block.inputs[1].value);
    block.inputs[1].read = true;
}

//clear Log Block
blocks.clearLogBlock.run = async (block) => {
    clearLog();
}

//value block
blocks.valueBlock.run = async (block) => {
    block.outputs[0].connections.forEach(connection => {
        let otherBlock = blocksObj[connection.block];
        otherBlock.inputs[connection.node].value = block.inputs[1].value;
        otherBlock.inputs[connection.node].read = false;
    });

}

//waitBlock
blocks.waitBlock.run = async (block) => {
    block.inputs[1].read = true;
    setTimeout(function () {

        block.outputs[0].connections.forEach(connection => {
            let blockTo = blocksObj[connection.block];
            blockTo.run(blockTo);
        });
    }, parseInt(block.inputs[1].value) * 1000);

}

//insBlock
blocks.insBlock.run = async (block) => {
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].run(blocksObj[connection.block]);
    });
}

//if block
blocks.ifBlock.run = async (block) => {
    block.inputs[1].read = true;
    if (block.inputs[1].value == true || block.inputs[1].value == "true") {
        block.outputs[0].connections.forEach(connection => {
            blocksObj[connection.block].run(blocksObj[connection.block]);
        });
    } else {
        block.outputs[1].connections.forEach(connection => {
            blocksObj[connection.block].run(blocksObj[connection.block]);
        });
    }
}

//superior block
blocks.superiorBlock.run = async (block) => {
    if (parseInt(block.inputs[1].value) > parseInt(block.inputs[2].value)) {
        block.outputs[0].connections.forEach(connection => {
            blocksObj[connection.block].inputs[connection.node].value = "true";
            blocksObj[connection.block].inputs[connection.node].read = false;
        });
    } else {
        block.outputs[0].connections.forEach(connection => {
            blocksObj[connection.block].inputs[connection.node].value = "false";
            blocksObj[connection.block].inputs[connection.node].read = false;
        });
    }
    block.inputs[1].read = true;
    block.inputs[2].read = true;
}

//equal block
blocks.equalBlock.run = async (block) => {
    if (parseInt(block.inputs[1].value) == parseInt(block.inputs[2].value)) {
        block.outputs[0].connections.forEach(connection => {
            blocksObj[connection.block].inputs[connection.node].value = "true";
            blocksObj[connection.block].inputs[connection.node].read = false;
        });
    } else {
        block.outputs[0].connections.forEach(connection => {
            blocksObj[connection.block].inputs[connection.node].value = "false";
            blocksObj[connection.block].inputs[connection.node].read = false;
        });
    }
    block.inputs[1].read = true;
    block.inputs[2].read = true;
}

//increment block
blocks.incrementBlock.run = async (block) => {
    block.inputs[1].read = true;
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].inputs[connection.node].value = parseInt(block.inputs[1].value) + 1;
        blocksObj[connection.block].inputs[connection.node].read = false;
    });
}

//decrement block
blocks.decrementBlock.run = async (block) => {
    block.inputs[1].read = true;
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].inputs[connection.node].value = parseInt(block.inputs[1].value) - 1;
        blocksObj[connection.block].inputs[connection.node].read = false;
    });
}

//multipal value in
blocks.multInBlock.run = async (block) => {
    let found = false;
    block.inputs.forEach(input => {
        if (!input.read && !found) {
            input.read = true;
            found = true;
            block.outputs[0].connections.forEach(connection => {
                blocksObj[connection.block].inputs[connection.node].value = input.value;
                blocksObj[connection.block].inputs[connection.node].read = false;
            });
        }
    });
}

//random block
blocks.randomBlock.run = async (block) => {
    block.inputs[1].read = true;
    let num = Math.floor(Math.random() * parseInt(block.inputs[1].value)) + 1;
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].inputs[connection.node].value = num.toString();
        blocksObj[connection.block].inputs[connection.node].read = false;
    });
}

//var Block
blocks.varBlock.run = async (block) => {
    block.inputs[1].read = true;
    let num = block.inputs[1].value;
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].inputs[connection.node].value = num;
        blocksObj[connection.block].inputs[connection.node].read = false;
    });
}

//pass Block
blocks.passBlock.run = async (block) => {
        block.inputs[1].read = true;
        block.outputs[1].connections.forEach(connection => {
            blocksObj[connection.block].inputs[connection.node].value = block.inputs[1].value;
            blocksObj[connection.block].inputs[connection.node].read = false;
        });
        block.outputs[0].connections.forEach(connection => {
            blocksObj[connection.block].run(blocksObj[connection.block]);
        });
}

//loop Block
blocks.loopBlock.run = async (block) => {
    block.inputs[1].read = true;
    for (let i = 0; i < block.inputs[1].value; i++) {
        block.outputs[1].connections.forEach(connection => {
            blocksObj[connection.block].inputs[connection.node].value = i.toString();
            blocksObj[connection.block].inputs[connection.node].read = false;
            checkInputStates();
        });
        block.outputs[0].connections.forEach(connection => {
            blocksObj[connection.block].run(blocksObj[connection.block]);
        });
    }
    
    block.outputs[2].connections.forEach(connection => {
        blocksObj[connection.block].run(blocksObj[connection.block]);
    });
}

//prompt Block
blocks.promptBlock.run = async (block) => {
    block.inputs[1].read = true;
    dialogs.prompt(block.inputs[1].value, ok => {
        block.outputs[0].connections.forEach(connection => {
            blocksObj[connection.block].inputs[connection.node].value = ok;
            blocksObj[connection.block].inputs[connection.node].read = false;
        });
    });
}

//alert Block
blocks.alertBlock.run = async (block) => {
    block.inputs[1].read = true;
    dialogs.alert(block.inputs[1].value);
}

//add Block
blocks.addBlock.run = async (block) => {
    block.inputs[1].read = true;
    block.inputs[2].read = true;
    let res = parseInt(block.inputs[1].value) + parseInt(block.inputs[2].value);
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].inputs[connection.node].value = res.toString();
        blocksObj[connection.block].inputs[connection.node].read = false;
    });
}

//sub Block
blocks.subBlock.run = async (block) => {
    block.inputs[1].read = true;
    block.inputs[2].read = true;
    let res = parseInt(block.inputs[1].value) - parseInt(block.inputs[2].value);
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].inputs[connection.node].value = res.toString();
        blocksObj[connection.block].inputs[connection.node].read = false;
    });
}

//add Str Block
blocks.addStrBlock.run = async (block) => {
    block.inputs[1].read = true;
    block.inputs[2].read = true;
    let res = block.inputs[1].value + block.inputs[2].value;
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].inputs[connection.node].value = res;
        blocksObj[connection.block].inputs[connection.node].read = false;
    });
}

//get Char Block
blocks.getCharBlock.run = async (block) => {
    block.inputs[1].read = true;
    block.inputs[2].read = true;
    let res = block.inputs[1].value[parseInt(block.inputs[2].value)];
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].inputs[connection.node].value = res;
        blocksObj[connection.block].inputs[connection.node].read = false;
    });
}

//str Len Block
blocks.strLen.run = async (block) => {
    block.inputs[1].read = true;
    let str = block.inputs[1].value;
    let res = 0;
    if(str) res = str.length;
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].inputs[connection.node].value = res.toString();
        blocksObj[connection.block].inputs[connection.node].read = false;
    });
}

//switch node Block
blocks.swichNodeBlock.run = async (block) => {
    block.inputs[1].read = true;
    block.outputs[0].connections.forEach(connection => {
        blocksObj[connection.block].run(blocksObj[connection.block]);
    });
}