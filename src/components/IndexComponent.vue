<template>
    <div>
        <h1>인덱스 페이지</h1>
        <button class="btn btn-blue" @click="startServer">서버 시작</button>
        <button class="btn btn-red" @click="stopServer">서버 종료</button>
        <span>{{this.$root.ipAddress}}</span>
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
        }
    }
}
</script>

<style>
</style>