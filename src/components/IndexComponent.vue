<template>
    <div>
        <h1>인덱스 페이지</h1>
        <button class="btn btn-blue" @click="startServer">서버 시작</button>
        <button class="btn btn-red" @click="stopServer">서버 종료</button>
        <span>{{this.$root.ipAddress}}</span>
        <button class="btn btn-blue" @click="refreshList">갱신</button>
    </div>
</template>

<script>
export default {
    name:'index',
    mounted(){

    },
    data(){
        return {

        };
    },
    methods:{
        startServer(){
            console.log("서버 시작");
            this.$root.startServer();
        },
        stopServer(){
            console.log("서버 종료");
            this.$root.stopServer();
        },
        refreshList(){
            console.log("문제데이터 갱신");
            this.$root.ipc.send("refreshList");
        }
    }
}
</script>

<style>
</style>