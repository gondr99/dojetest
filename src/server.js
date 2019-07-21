import Vue from 'vue';

import IndexComponent from './components/IndexComponent';
import AddComponent from './components/AddComponent';

import {ipcRenderer, shell} from 'electron';
import Router from 'vue-router';

const router = new Router({
    routes:[
        {
            path:'/',
            component:IndexComponent
        },
        {
            path:'/add',
            component:AddComponent
        }
    ]
})

Vue.component('index-component', IndexComponent);
Vue.component('add-component', AddComponent);
Vue.use(Router);

new Vue({
    el:"#app",
    router,
    mounted(){
        this.ipc.send('mount-complete'); //마운트 완료되었음을 알려줌.
        this.ipc.on('update-need', (e, arg) => {
            alert('서버에 신버전이 등록되었습니다. 업그레이드 해주세요.');
            //아직 미완성
			shell.openExternal("http://www.gmsgondr.net/product");
        });
        this.ipc.on('send-version', (e, arg)=>{
			this.version = arg.version;
        });
        
        this.ipAddress = this.ipc.sendSync('getAddress');
    },
    data: {
        ipc:ipcRenderer,
        version:'0.0.1',
        problemList:[],
        ipAddress:'',
        showModal:false,
    },
    methods:{
        openDevTool(){
            this.ipc.send("openDevTools");
        },

        startServer(){
            this.ipc.send("serverStart");
        },
        stopServer(){
            console.log("서버 종료명령 ipc로 전송")
            this.ipc.send("serverStop");
        },
        openLoginWindow(){
            this.showModal = true;
        }
    }
});