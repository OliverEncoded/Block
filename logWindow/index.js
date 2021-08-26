const { ipcRenderer } = require('electron');

// When the action-update-label event is triggered (from the main process)
// Do something in the view
ipcRenderer.on('update-log', (event, toLog) => {
    document.getElementById("log").value = document.getElementById("log").value + '\n' + toLog;
});

ipcRenderer.on('clear-log', (event, toLog) => {
    document.getElementById("log").value = "";
});

