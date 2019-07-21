<template>
    <div>
        <h2 class="title">문제 등록</h2>
        <form class="register-form">
            <input class="input-form" type="text" placeholder="문제의 제목 입력" v-model="formData.title">
            <textarea class="input-form" placeholder="문제의 내용을 입력하세요" v-model="formData.content" rows="10"></textarea>
            <input class="input-form" type="file" placeholder="이미지" @change="changeFile" accept="image/*">
            <input class="input-form" type="answer" placeholder="문제의 정답을 입력하세요" v-model="formData.answer">
            <button class="btn btn-blue" type="button" @click="sendData">전송</button>
        </form>
    </div>
</template>

<script>
export default {
    name:'add',
    mounted(){
        console.log("마운트");
    },
    data(){
        return {
            formData:{  
                title:'',
                content:'',
                image:'',
                answer:''
            }
        };
    },
    methods:{
        sendData(){
            if(this.formData.title.trim() == ""){
                alert("제목이 비어있습니다.");
                return;
            }
            if(this.formData.content.trim() == "" && this.formData.image == ""){
                alert("내용이나 이미지 모두 비어있을 수는 없습니다.");
                return;
            }
            if(this.formData.answer.trim() == ""){
                alert("정답이 비어있습니다.");
                return;
            }

            let result = this.$root.ipc.sendSync("upload-problem", this.formData);
            
        },
        changeFile(e){
            let file = e.target.files[0]; //이미지 파일 뽑아서 
            if(file == undefined) return;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener("load", ()=>{
                this.formData.image = reader.result;
            });
            reader.addEventListener("error", ()=>{
                alert("이미지 파일에 오류가 있습니다. 확인후 다시 업로드 하세요.");
            });
        }
    }
}
</script>

<style>
    .title {
        margin-bottom:15px;
    }
    .register-form {
        width:80%;
        display:flex;
        flex-direction: column;
    }

    .input-form {
        width:100%;
        padding:8px 12px;
        margin-bottom:10px;
        line-height: 1.5;
        background-color: #fff;
        border:1px solid #ced4da;
        border-radius: 0.25rem;
        transition:all 0.15s;
    }
</style>