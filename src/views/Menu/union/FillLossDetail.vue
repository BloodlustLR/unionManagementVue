<template>
<div class="fillLossDetail">
    <div class="main-board">
        <div class="display-type">
            <el-radio-group v-model="displayType" size="small">
                <el-radio-button label="detail">详情</el-radio-button>
                <el-radio-button label="counts">统计</el-radio-button>
            </el-radio-group>
        </div>

        <div class="content">
            
        </div>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            displayType:'detail'

        }
    }
}
</script>
<style lang="less">
.fillLossDetail{
    height:100%;
    width:100%;
    padding-top:20px;

    .main-board{
        height:90%;
        width:90%;
        margin:0 auto;
        background-color: white;

        .display-type{
            height:40px;
            text-align: center;
            padding-top:10px;
        }

        .content{
            height:calc(90% - 40px);
        }
    }
}
</style>