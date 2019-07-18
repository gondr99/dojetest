'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');

const defaultProps = {
    width:800,
    height:600,
    resizeable:false,
    webPreferences: {
        nodeIntegration: true,
        nativeWindowOpen: true,
		nodeIntegrationInWorker: true,
    }
};

let win = null; //메인 윈도우 창

function createWindow(){
    win = new BrowserWindow(defaultProps);
    win.setMenu(null);
    win.loadFile("index.html");
    win.on("close", ()=>{
        win = null; //초기화
    });
}

app.on("ready", ()=>{
    createWindow();
});