'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const express = require('express');
const http = require('http');
const path = require('path');
const request = require('request');
const os = require('os'); //ip 받아오기 위한 os모듈
const bodyParser = require('body-parser');

const dbInfo = require('./src/db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbInfo); //데이터베이스 연결정보
/*****************************************
 * module.exports = 
    {
        host:'gondr.asuscomm.com',
        user:'유저정보',
        password:'비밀번호',
        port:3306,
        database:'데이터베이스'
    }
******************************************/

const defaultProps = {
    width:1200,
    height:750, //헤더 30픽셀 포함.
    resizable:false,
    webPreferences: {
        nodeIntegration: true,
        nativeWindowOpen: true,
		nodeIntegrationInWorker: true,
    }
};
const version = "0.1.1"; //버전

let win = null; //메인 윈도우 창

const ifaces = os.networkInterfaces(); //네트워크 어댑터 다 가져와서
let serverIpAddress = '';

//서버의 ip주소 알아내기
for(let key in ifaces){
    for(let i = 0; i < ifaces[key].length; i++){
        if(ifaces[key][i].family == 'IPv4' && ifaces[key][i].address != '127.0.0.1') {
            serverIpAddress = ifaces[key][i].address;
        }
    }
}

//디버그용. 차후 수정예정
let user = {
    id:1,
    email:"gondr99@gmail.com",
    name:"최선한"
}

function createWindow(){
    win = new BrowserWindow(defaultProps);
    win.setMenu(null);
    win.loadFile("index.html");
    win.on("close", ()=>{
        win = null; //초기화
    });
    win.webContents.openDevTools();
}

/********************************
 * 
 * Express관련 셋팅들
 * 
 ***********************************/

//익스프레스 가동준비
let server = null;
let expressApp = new express();  

app.on("ready", ()=>{
    createWindow();  
    expressApp.set('port', 19090);
    expressApp.set('views', path.join(__dirname, 'views'));
    expressApp.set('view engine', 'ejs');
    // expressApp.use(express.json()); //미들웨어로 바디파서 사용
    // expressApp.use(express.urlencoded()); // to support URL-encoded bodies
    expressApp.use(bodyParser.urlencoded({extended:true}));
    expressApp.use(express.static( path.join(__dirname, 'dist/public')));

    expressApp.get('/', (req, res) => {
        res.render(
            'clientmain', {msg:'Welcome to Express'}
        );
    });

    server = http.createServer(expressApp);
});

/********************************
 * 
 * IPC관련 프로토콜 매서드들 
 * 
 ***********************************/
//첫 로딩시 버전 확인
let problemList = [];
ipcMain.on('mount-complete', (e, arg)=>{
    request('http://data.gondr.net/version.php?product=dojetest', {}, (err, res, body) => {
        let data = JSON.parse(body);
        if(data.version != undefined && data.version > version) {
            win.webContents.send('update-need', {version:data.version, publishedDate:data.publishedDate});
        }else{
            win.webContents.send('send-version', {version:version});
        }
    });
    connection.query("SELECT * FROM problems", (err, rows)=>{
        problemList = rows;
    });
});

//개발자도구 켜기
ipcMain.on("openDevTools", (e ,arg) => {
    win.webContents.openDevTools();
});

//서버 켜기
ipcMain.on("serverStart", (e, arg) => {
    server.listen(expressApp.get('port'), ()=>{
        console.log(`Express engine start with port : ${expressApp.get('port')}`);
    });
});

//서버 끄기
ipcMain.on("serverStop", (e, arg)=>{
    console.log("receiving teminate server operation");
    server.close();
});

//서버 주소 가져오기
ipcMain.on("getAddress", (e, arg)=>{
    if(serverIpAddress != ''){
        e.returnValue = serverIpAddress;
    }else{
        e.returnValue = '알수없는 IP';
    }
});

//저장된 문제 데이터 가져오기
ipcMain.on("getList", (e, arg)=>{
    win.webContents.send('sendList', {data:problemList}); //가져온 문제 보내주기
});

//서버의 문제 데이터로 갱신하기
ipcMain.on("refreshList", (e, arg)=>{
    connection.query("SELECT * FROM problems", (err, rows)=>{
        problemList = rows;
        win.webContents.send('sendList', {data:problemList}); //가져온 문제 보내주기
    });
});

//서버로 문제 업로드
ipcMain.on("upload-problem", (e, arg)=>{
    let sql = "INSERT INTO problems(`title`, `content`, `answer`, `image`, `owner`) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [arg.title, arg.content, arg.answer, arg.image, user.id], (err, rows) => {
        e.returnValue = rows.insertId;
    });

});