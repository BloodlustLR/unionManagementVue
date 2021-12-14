<template>
<div class="reportPayment">
    <div class="payment-box">
        <div class="payment-item">补损编号-{{paymentInfo.id}}</div>
        <div class="payment-item">补损名-{{paymentInfo.name}}</div>
        <div class="payment-item">允许时间段-{{paymentInfo.lossStartTime}}至{{paymentInfo.lossEndTime}}</div>
        <div class="payment-item">允许地区-{{paymentInfo.limitArea}}</div>
        <div class="payment-item">允许星域-{{paymentInfo.limitConstellation}}</div>
        <div class="payment-item">允许星系-{{paymentInfo.limitGalaxy}}</div>
        <div class="payment-item">截止时间-{{paymentInfo.endTime}}</div>
    </div>
    <div style="margin-top:20px">
        <el-upload v-if="!hasOutOfDate" :action="uploadUrl" :on-success="handleSuccess" :show-file-list="false" drag multiple>
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
        <div v-else>该补损已过期</div>
        <div class="report-box" v-if="detectResult!=null">
            <div class="report-item">报告编号：{{detectResult.reportId}}</div>
            <div class="report-item">时间：{{detectResult.reportTime}}</div>
            <div class="report-item">角色名称：{{detectResult.characterName}}</div>
            <div class="report-item">舰船名：{{detectResult.shipName}}</div>
            <div class="report-item">地区：{{detectResult.area}}</div>
            <div class="report-item">星域：{{detectResult.constellation}}</div>
            <div class="report-item">星系：{{detectResult.galaxy}}</div>
            <div class="report-item">金额：{{detectResult.money}}星币</div>
            <div class="report-item">最后一击：{{detectResult.kmShip}}</div>
            <div class="report-item">最高伤害：{{detectResult.highATKShip}}</div>
            <div class="report-item" style="text-align:center;margin-top:20px">
                <el-button type="primary" @click="submit">上报</el-button>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            paymentInfo:{
                id:null,
                name:null,
                endTime:null,
                lossStartTime:null,
                lossEndTime:null,
                limitArea:[],
                limitConstellation:[],
                limitGalaxy:[]
            },
            hasOutOfDate:true,
            uploadUrl:'/api/ocr/detectPic',
            detectResult:null
        }
    },
    created(){
        this.paymentInfo.id = this.$route.query.pid;
        if(this.paymentInfo.id!=null){
            this.getPaymentInfo();
        }
    },
    methods:{
        getPaymentInfo(){
            this.$request.get("/payment/getPaymentInfo",{
                pid:this.paymentInfo.id
            }).then(res=>{
                this.paymentInfo.name = res.obj.name;
                this.paymentInfo.endTime = res.obj.endTime;
                this.paymentInfo.lossStartTime = res.obj.lossStartTime;
                this.paymentInfo.lossEndTime = res.obj.lossEndTime;
                this.paymentInfo.limitArea = JSON.parse(res.obj.limitArea);
                this.paymentInfo.limitConstellation = JSON.parse(res.obj.limitConstellation);
                this.paymentInfo.limitGalaxy = JSON.parse(res.obj.limitGalaxy);

                this.hasOutOfDate = new Date().getTime()>new Date(this.paymentInfo.endTime).getTime();
            })
        },
        handleSuccess(response, file, fileList){
            console.log(response, file, fileList);
            this.detectResult = response.obj;
        },

        submit(){

        }
    }

}
</script>
<style lang="less">
.reportPayment{
    text-align: center;

    .payment-box{
        width:600px;
        margin: 0 auto;
        margin-top:40px;
        text-align: left;

        .payment-item{
            height:20px;
            line-height:20px;
        }
    }

    .report-box{
        width:400px;
        margin: 0 auto;
        margin-top:50px;
        text-align: left;


        .report-item{
            height:20px;
            line-height:20px;
        }
    }
}
</style>