<template>
<div class="system">
    <div class="main-board">
        <div class="setting-item">
            星币汇率: 1亿ISK = <el-input-number v-model="$store.getters.systemInfo.rate" :min="0.1" :precision="1" :step="0.1" step-strictly size="small" :controls="false"/> RMB
        </div>
    </div>
    <div class="bottom-board">
        <el-button type="primary" @click="applySetting">应用</el-button>
    </div>
</div>
</template>
<script>
import { ElMessageBox,ElMessage } from 'element-plus'
export default {
    data(){
        return{
            
        }
    },
    created(){
        
    },
    methods:{
        /**
         * 保存系统设定
         */
        applySetting(){
            let data = this.$store.getters.systemInfo;
            this.$request.post("/sys/updateInfo",data).then(res=>{
                ElMessage({
                    message: '修改成功',
                    type: 'success'
                })
                this.loadSystem();
            })
        },
        /**
         * 读取系统设定
         */
        loadSystem(){
            this.$request.get("/sys/getInfo").then(res=>{
                console.log(res);
                this.$store.commit("handleSystemInfo",res.obj);
            })
        },
    }
}
</script>
<style lang="less">
.system{
    height:100%;
    width:100%;
    padding-top:20px;

    .main-board{
        height:80%;
        width:90%;
        margin:0 auto;
        background-color: white;
        text-align: center;

        .setting-item{
            padding:20px 0;
        }
    }

    .bottom-board{
        height:60px;
        line-height:60px;
        width:90%;
        margin:0 auto;
        text-align: center;
    }
}
</style>