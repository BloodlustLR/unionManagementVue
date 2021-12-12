<template>
<div class="reportPayment">
    <div>补损编号-{{paymentId}}</div>
    <div style="margin-top:20px">
        <el-upload :action="uploadUrl" :on-success="handleSuccess" :show-file-list="false" drag>
            <svg class="icon" width="200" height="140" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-365b8594=""><path fill="#1E90FF" d="M544 864V672h128L512 480 352 672h128v192H320v-1.6c-5.376.32-10.496 1.6-16 1.6A240 240 0 0164 624c0-123.136 93.12-223.488 212.608-237.248A239.808 239.808 0 01512 192a239.872 239.872 0 01235.456 194.752c119.488 13.76 212.48 114.112 212.48 237.248a240 240 0 01-240 240c-5.376 0-10.56-1.28-16-1.6v1.6H544z"></path></svg>
            <div class="el-upload__text">
            拖拽文件到这里或者<em>点击上传</em>
            </div>
            <template #tip>
            <div class="el-upload__tip">
                只支持jpg/png文件
            </div>
            </template>
        </el-upload>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            paymentId:null,
            // uploadUrl:'http://1001.jzzlkj.top:81/imgocr/upimg.php'
            // uploadUrl:'/imgocr/upimg.php'
            uploadUrl:'/api/ocr/detectPic'
        }
    },
    created(){
        this.paymentId = this.$route.query.pid;
    },
    methods:{
        handleSuccess(response, file, fileList){
            console.log(response, file, fileList);
        }
    }

}
</script>
<style lang="less">
.reportPayment{
    text-align: center;

}
</style>