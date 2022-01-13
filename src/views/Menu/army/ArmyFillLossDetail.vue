<template>
<div class="armyFillLossDetail">
    <div class="main-board">
        <div class="content">
            <div class="detail">
                <div class="detail-left">
                    <div class="payment-box">
                        <div class="payment-item" style="font-weight:bolder">补损编号- {{paymentInfo.id}}</div>
                        <div class="payment-item" style="font-weight:bolder">补损名- {{paymentInfo.name}}</div>
                        <div class="payment-item" style="font-weight:bolder">起始时间- {{paymentInfo.lossStartTime}}</div>
                        <div class="payment-item" style="font-weight:bolder">结束时间- {{paymentInfo.lossEndTime}}</div>
                        <div class="payment-item" style="font-weight:bolder">允许星域- {{paymentInfo.limitArea==null?'无限制':paymentInfo.limitArea}}</div>
                        <div class="payment-item" style="font-weight:bolder">允许星座- {{paymentInfo.limitConstellation==null?'无限制':paymentInfo.limitConstellation}}</div>
                        <div class="payment-item" style="font-weight:bolder">允许星系- {{paymentInfo.limitGalaxy==null?'无限制':paymentInfo.limitGalaxy}}</div>
                        <div class="payment-item" style="font-weight:bolder">截止时间- {{paymentInfo.endTime}}</div>
                        <div class="payment-item" style="font-weight:bolder;margin-top:20px">损失总额:  {{Math.round(armyLossTotal/100000000)}}亿星币【¥{{Math.round(armyLossTotal/100000000)*paymentInfo.rate}}】</div>
                        <div class="payment-item" style="font-weight:bolder">补损总额:  {{armyTotal/100000000}}亿星币【¥{{armyTotal/100000000*paymentInfo.rate}}】<el-button type="primary" size="mini" @click="standardPaymentModal=true">补损标准</el-button></div>
                    </div>
                </div>
                <div class="detail-right">
                    <div class="army-info">军团损失共计:{{Math.round(armyLossTotal/100000000)}}亿星币【¥{{(Math.round(armyLossTotal/100000000)*paymentInfo.rate).toFixed(2)}}】,军团补损总额: {{armyTotal/100000000}}亿星币【¥{{(armyTotal/100000000*paymentInfo.rate).toFixed(2)}}】</div>
                    <div class="army-detail">
                        <div class="detail-item" v-for="(item,index) in armyLossList" :key="'armyLoss_'+index">
                            <el-card :class="{'box-card':true,'box-card-modify':item.isModify}" style="height:220px;width:90%;margin:10px auto;text-align:left">
                                <div class="report-item">编号: {{item.id}}</div>
                                <div class="report-item">舰船名: {{item.shipName}}</div>
                                <div class="report-item">时间: {{item.lossTime}}</div>
                                <div class="report-item">星域: {{item.area}}</div>
                                <div class="report-item">星座: {{item.constellation}}</div>
                                <div class="report-item">星系: {{item.galaxy}}</div>
                                <div class="report-item">金额: {{item.num}}星币</div>
                                <div class="report-item">最后一击: {{item.kmShip}}</div>
                                <div class="report-item">最高伤害: {{item.highAtkShip}}</div>

                                <div class="box-remove" @click="removeLoss(index)">X</div>
                                <div class="box-info">
                                    <span style="margin-right:20px">{{item.price/100000000}}亿星币</span>
                                    <el-button type="primary" size="mini" @click="openModifyModal(item)">修改</el-button>
                                    <el-button type="primary" size="mini" @click="openImgModal(item.img)">查看截图</el-button>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="modifyModal" title="补损详情" width="500px">
        <div class="modify-box">
            <div class="modify-item">
                <span style="margin-right:10px">时间</span>
                <el-date-picker v-model="lossInfo.reportTime" type="datetime" placeholder="请选择损失时间" disabled></el-date-picker>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">舰船名</span>
                <el-select v-model="lossInfo.shipName" placeholder="请选择舰船名" style="width:220px" filterable>
                    <el-option v-for="item in shipList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">星域</span>
                <el-input v-model="lossInfo.area" placeholder="请输入星域" style="width:220px" disabled/>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">星座</span>
                <el-input v-model="lossInfo.constellation" placeholder="请输入星座" style="width:220px"/>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">星系</span>
                <el-input v-model="lossInfo.galaxy" placeholder="请输入星系" style="width:220px"/>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">金额</span>
                <el-input-number v-model="lossInfo.money" :min="0" :step="1" :precision="0" step-strictly style="width:220px"/>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">最后一击</span>
                <el-input v-model="lossInfo.kmShip" placeholder="请输入最后一击舰船名" style="width:220px"/>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">最高伤害</span>
                <el-input v-model="lossInfo.highATKShip" placeholder="请输入最高伤害舰船名" style="width:220px"/>
            </div>
        </div>
        <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="modifyData">确认</el-button>
            <el-button @click="modifyModal = false">关闭</el-button>
        </span>
        </template>
    </el-dialog>

    <el-dialog v-model="imgModal" title="截图" width="920px">
        <img :src="imgSrc" style="width:888px;height:500px;"/>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="imgModal = false">关闭</el-button>
        </span>
        </template>
    </el-dialog>

    <el-dialog v-model="standardPaymentModal" title="补损标准" width="920px">
        <div>星币汇率:{{paymentInfo.rate}}RMB/亿</div>
        <div style="margin-top:20px;">
            <el-table :data="standardPaymentList" style="width: 100%">
                <el-table-column prop="name" label="类型" width="180" />
                <el-table-column label="补损额" width="180">
                    <template #default="scope">
                        {{scope.row.num/100000000}}亿【¥{{(scope.row.num/100000000*paymentInfo.rate).toFixed(2)}}】
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="standardPaymentModal = false">关闭</el-button>
            </span>
        </template>
    </el-dialog>
</div>
</template>
<script>
import { ElMessageBox, ElMessage } from 'element-plus';

export default {
    data(){
        return{
            armyId:null,
            armyShortName:null,
            paymentInfo:{
                id:null,
                name:null,
                rate:1,
                endTime:null,
                lossStartTime:null,
                lossEndTime:null,
                limitArea:null,
                limitConstellation:null,
                limitGalaxy:null
            },
            standardPaymentModal:false,
            standardPaymentList:[],
            paymentShipList:[],
            armyLossList:[],
            armyList:[],
            shipList:[],

            modifyModal:false,
            lossInfo:{
                reportId:null,
                reportTime:null,
                shipName:'',
                area:'',
                constellation:'',
                galaxy:'',
                money:'',
                kmShip:'',
                highATKShip:'',
                img:null
            },

            imgModal:false,
            imgSrc:''
        }
    },
    computed:{
        armyLossTotal(){
            let total = 0;
            for(let armLoss of this.armyLossList){
                if(armLoss.num){
                    total+=armLoss.num;
                }
            }
            return total;
        },
        armyTotal () {
            let total = 0;
            for(let armLoss of this.armyLossList){
                if(armLoss.price){
                    total+=armLoss.price;
                }
            }
            return total;
        }
    },
    created(){
        this.paymentInfo.id = this.$route.query.pid;
        this.armyShortName = this.$store.state.loginInfo.shortArmy;
        this.refreshAllDetail(this.armyShortName);
    },
    mounted(){

    },
    methods:{
        refreshAllDetail(shortArmy){
            this.getArmyInfo(shortArmy);
            this.getAllShip();
            this.getPaymentInfo();
            this.getPymentShipList();
        },

        getAllShip(){
            this.$request.get("/ship/getAllShip").then(res =>{
                console.log(res.obj);
                this.shipList = res.obj;
            })
        },

        getArmyInfo(shortArmy){
            this.$request.get("/army/getAllArmy").then(res =>{
                this.armyList = res.obj;
                for(let item of this.armyList){
                    console.log(item);
                    if(item.shortName==shortArmy){
                        this.armyId = item.id;
                        break;
                    }
                }
                this.getPaymentArmyLoss();
            })
        },

        getPaymentArmyLoss(){
            this.$request.post("/loss/getPaymentArmyLoss",{
                paymentId:this.paymentInfo.id,
                armyId:this.armyId
            }).then(res=>{
                this.armyLossList = res.obj;
                for(let item of this.armyLossList){
                    for(let standardShip of this.paymentShipList){
                        if(item.shipName == standardShip.name){
                            item.price = standardShip.price;
                            break;
                        }
                    }
                }
                console.log("this.armyLossList",this.armyLossList);
            })
        },

        getPaymentInfo(){
            this.$request.get("/payment/getPaymentInfo",{
                pid:this.paymentInfo.id
            }).then(res=>{
                this.paymentInfo.name = res.obj.name;
                this.paymentInfo.rate = res.obj.rate;
                this.paymentInfo.endTime = res.obj.endTime;
                this.paymentInfo.lossStartTime = res.obj.lossStartTime;
                this.paymentInfo.lossEndTime = res.obj.lossEndTime;
                this.paymentInfo.limitArea = res.obj.limitArea==null?null:JSON.parse(res.obj.limitArea);
                this.paymentInfo.limitConstellation = res.obj.limitConstellation==null?null:JSON.parse(res.obj.limitConstellation);
                this.paymentInfo.limitGalaxy = res.obj.limitGalaxy==null?null:JSON.parse(res.obj.limitGalaxy);
                this.standardPaymentList = res.obj.standardPaymentList;
            })
        },

        getPymentShipList(){
            this.$request.get("/payment/getPaymentShipList",{
                pid:this.paymentInfo.id
            }).then(res=>{
                console.log("paymentShip",res.obj);
                this.paymentShipList = res.obj;
            })
        },

        openModifyModal(value){
            console.log(value);
            this.lossInfo.reportId = value.id;
            this.lossInfo.reportTime = value.lossTime==null?null:new Date(value.lossTime);
            this.lossInfo.shipName = value.shipName;
            this.lossInfo.area = value.area;
            this.lossInfo.constellation = value.constellation;
            this.lossInfo.galaxy = value.galaxy;
            this.lossInfo.money = Number(value.num);
            this.lossInfo.kmShip = value.kmShip;
            this.lossInfo.highATKShip = value.highAtkShip;
            this.lossInfo.img = value.img;
            this.modifyModal = true;
        },

        modifyData(){
            let data = {
                paymentId: this.paymentInfo.id,
                reportId: this.lossInfo.reportId,
                reportTime: this.lossInfo.reportTime.format("yyyy-MM-dd hh:mm:ss"),
                armyShortName: this.armyShortName,
                shipName: this.lossInfo.shipName,
                area: this.lossInfo.area,
                constellation: this.lossInfo.constellation,
                galaxy: this.lossInfo.galaxy,
                money: this.lossInfo.money,
                kmShip: this.lossInfo.kmShip,
                highATKShip: this.lossInfo.highATKShip,
                img: this.lossInfo.img,
                isModify: 1
            }
            this.$request.post("/loss/updateLoss",data).then(res=>{
                if(res.obj=="success"){
                    ElMessage({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.getPaymentArmyLoss();
                    this.modifyModal = false;
                }else{
                    ElMessage.error(res.obj);
                }
            })
        },

        removeLoss(index){
            ElMessageBox.confirm(
                '是否确认删除此报损?',
                '删除报损',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.$request.post("/loss/removeLoss",{
                    id:this.armyLossList[index].id
                }).then(res => {
                    if(res.obj=="success"){
                        ElMessage({
                            message: '删除成功',
                            type: 'success',
                        })
                        this.armyLossList.splice(index,1);
                        this.refreshAllDetail();
                    }else{
                        ElMessage.error('删除失败');
                    }
                })
            }).catch(() => {

            })
        },

        openImgModal(imgSrc){
            this.imgSrc = imgSrc;
            this.imgModal = true;
        }
    }
}
</script>
<style lang="less">
.armyFillLossDetail{
    height:100%;
    width:100%;
    padding-top:20px;

    .main-board{
        height:90%;
        width:90%;
        margin:0 auto;
        background-color: white;

        // .display-type{
        //     height:40px;
        //     text-align: center;
        //     padding-top:10px;
        // }

        .content{
            // height:calc(100% - 40px);
            height: 100%;
            width: 100%;

            .detail{
                height:100%;
                width:100%;

                .detail-left{
                    float:left;
                    height:100%;
                    width:30%;

                    .payment-box{
                        height:240px;
                        overflow-y: auto;
                        text-align: left;
                        padding-left: 20px;
                        

                        .payment-item{
                            height:20px;
                            line-height:20px;
                        }
                    }

                    .army-box{
                        height:calc(100% - 242px);
                        width:calc(100% - 1px);
                        overflow-y: auto;
                        border:1px solid black;
                        border-right:none;
                    }

                }

                .detail-right{
                    float:right;
                    height:calc(100% - 2px);
                    width:calc(70% - 2px);
                    border: 1px solid black;

                    .army-info{
                        height:59px;
                        line-height:59px;
                        border-bottom: 1px solid black;
                        text-align: center;
                        font-weight: bolder;
                    }

                    .army-detail{
                        height:calc(100% - 60px);
                        width:100%;
                        overflow-y: auto;

                        .detail-item{
                            height:240px;
                            width:100%;

                            .box-card{
                                position:relative;

                                .box-remove{
                                    position:absolute;
                                    right:15px;
                                    top:10px;
                                    color:red;
                                }

                                .box-remove:hover{
                                    cursor: pointer;
                                }

                                .box-img{
                                    position: absolute;
                                    right:20px;
                                    bottom:20px;

                                    img{
                                        height:90px;
                                        width:120px;
                                    }
                                }

                                .box-info{
                                    position: absolute;
                                    right:20px;
                                    bottom:20px;
                                    color:tomato;
                                }
                            }

                            .box-card-modify{
                                background-color: coral;

                                .box-info{
                                    color:#303133;
                                }
                            }
                        }
                    }


                }
            }

            .count{
                height:100%;
                width:100%;
                text-align: center;
                overflow-y: auto;

                .count-item{
                    height:400px;
                    width:600px;
                    margin: 20px;
                    background-color: rgb(38,50,56);
                    vertical-align: middle;
                    display: inline-block;
                }
            }



        }
    }

    .modify-box{
        text-align: center;

        .modify-item{
            height:45px;
            line-height:45px;
        }
    }
}
</style>