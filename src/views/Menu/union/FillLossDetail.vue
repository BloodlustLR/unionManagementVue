<template>
<div class="fillLossDetail">
    <div class="main-board">
        <div class="display-type">
            <el-radio-group v-model="displayType" size="small" @change="changeLabel">
                <el-radio-button label="detail">详情</el-radio-button>
                <el-radio-button label="count">统计</el-radio-button>
            </el-radio-group>
        </div>

        <div class="content">
            <div class="detail" v-show="displayType=='detail'">
                <div class="detail-left">
                    <div class="payment-box">
                        <div class="payment-item" style="font-weight:bolder">补损编号- {{paymentInfo.id}}</div>
                        <div class="payment-item" style="font-weight:bolder">补损名- {{paymentInfo.name}}</div>
                        <div class="payment-item" style="font-weight:bolder">起始时间- {{paymentInfo.lossStartTime}}</div>
                        <div class="payment-item" style="font-weight:bolder">结束时间- {{paymentInfo.lossEndTime}}</div>
                        <div class="payment-item" style="font-weight:bolder">允许星域- {{paymentInfo.limitArea}}</div>
                        <div class="payment-item" style="font-weight:bolder">允许星座- {{paymentInfo.limitConstellation}}</div>
                        <div class="payment-item" style="font-weight:bolder">允许星系- {{paymentInfo.limitGalaxy}}</div>
                        <div class="payment-item" style="font-weight:bolder">截止时间- {{paymentInfo.endTime}}</div>
                        <div class="payment-item" style="font-weight:bolder;margin-top:20px">损失总额:  {{Math.round(totalLoss/100000000)}}亿星币</div>
                        <div class="payment-item" style="font-weight:bolder">补损总额:  {{totalPrice/100000000}}亿星币</div>
                    </div>
                    <div class="army-box">
                        <el-tree :data="unionArmyList" :props="defaultProps"  @node-click="handleNodeClick"/>
                    </div>
                </div>
                <div class="detail-right">
                    <div class="army-info">军团损失共计:{{Math.round(armyLossTotal/100000000)}}亿星币,军团补损总额: {{armyTotal/100000000}}亿星币</div>
                    <div class="army-detail">
                        <div class="detail-item" v-for="(item,index) in armyLossList" :key="'armyLoss_'+index">
                            <el-card :class="{'box-card':true,'box-card-modify':item.isModify}" style="height:240px;width:90%;margin:10px auto;text-align:left">
                                <div class="report-item">编号: {{item.id}}</div>
                                <div class="report-item">舰船名: {{item.shipName}}</div>
                                <div class="report-item">时间: {{item.lossTime}}</div>
                                <div class="report-item">星域: {{item.area}}</div>
                                <div class="report-item">星座: {{item.constellation}}</div>
                                <div class="report-item">星系: {{item.galaxy}}</div>
                                <div class="report-item">金额: {{thousandBitSeparator(item.num)}}星币</div>
                                <div class="report-item">最后一击: {{item.kmShip}}</div>
                                <div class="report-item">最高伤害: {{item.highAtkShip}}</div>

                                <div class="box-remove" @click="removeLoss(index)">X</div>
                                <div class="box-info">
                                    <span style="margin-right:20px">{{item.price/100000000}}亿星币</span>
                                    <el-button type="primary" size="mini" @click="openImgModal(item.img)">查看截图</el-button>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </div>
            </div>
            <div class="count" v-if="displayType=='count'">
                <div id="army_count" class="count-item"></div>
                <div id="ship_type_count" class="count-item"></div>
            </div>
        </div>
    </div>

    <el-dialog v-model="imgModal" title="截图" width="920px">
        <img :src="imgSrc" style="width:888px;height:500px;"/>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="imgModal = false">关闭</el-button>
        </span>
        </template>
    </el-dialog>
</div>
</template>
<script>
import * as echarts from 'echarts';
import { ElMessageBox, ElMessage } from 'element-plus';

export default {
    data(){
        return{
            displayType:'detail',

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
            paymentShipList:[],
            totalLoss:0,
            totalPrice:0,

            unionArmyList:[],
            defaultProps: {
                children: 'armyList',
                label: 'name',
            },

            armyLossList:[],
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
    mounted(){
        this.paymentInfo.id = this.$route.query.pid;
        this.refreshAllDetail();
    },
    methods:{

        changeLabel(value){
            if(value == "detail"){
                this.$nextTick(()=>{
                    this.refreshAllDetail();
                })
            }else if(value == "count"){
                this.$nextTick(()=>{
                    this.refreshAllDiagram();
                })
            }
        },

        refreshAllDetail(){
            this.getPaymentInfo();
            this.getPymentShipList();
            this.getPaymentTotal();
            this.getPaymentUnionArmy();
        },

        refreshAllDiagram(){
            this.getPaymentAllArmyLoss();
            this.getPaymentAllTypeLoss();
        },

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

        getPaymentTotal(){
            this.$request.get("/payment/getPaymentTotal",{
                pid:this.paymentInfo.id
            }).then(res=>{
                this.totalLoss = res.obj.lossTotal;
                this.totalPrice = res.obj.priceTotal;
            })
        },

        getPaymentUnionArmy(){
            this.$request.get("/payment/getPaymentUnionArmy",{
                pid:this.paymentInfo.id
            }).then(res=>{
                this.unionArmyList = res.obj;
                console.log(this.unionArmyList);
            })
        },

        getPaymentAllArmyLoss(){

            this.$request.get("/loss/getPaymentAllArmyLoss",{
                pid:this.paymentInfo.id
            }).then(res=>{
                console.log("loss",res.obj);
                if(window.armyLossDiagram){
                    window.armyLossDiagram.dispose(); // 销毁实例
                }
                window.armyLossDiagram = echarts.init(document.getElementById('army_count'));// 再次创建实例
                debugger
                let category = [];
                let data = [];
                let sortData = [];
                for(let armyName in res.obj){
                    category.push(armyName);
                    data.push(res.obj[armyName]);
                    sortData.push(res.obj[armyName]);
                }
                sortData.sort();
                let max = parseInt(sortData[0]/100000000)*100000000+1000000000;
                debugger
                let option = {
                    backgroundColor:'#323a5e',
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                        },
                        grid: {
                            left: '2%',
                            right: '4%',
                            bottom: '14%',
                            top:'16%',
                            containLabel: true
                        },
                        legend: {
                        data: ['损失KM'],
                        right: 10,
                        top:12,
                        textStyle: {
                            color: "#fff"
                        },
                        itemWidth: 12,
                        itemHeight: 10,
                        // itemGap: 35
                    },
                    xAxis: {
                        type: 'category',
                        data: category,
                        axisLine: {
                            lineStyle: {
                            color: 'white'

                            }
                        },
                        axisLabel: {
                            // interval: 0,
                            // rotate: 40,
                            textStyle: {
                            fontFamily: 'Microsoft YaHei'
                            }
                        },
                    },
                    yAxis: {
                        type: 'value',
                        max: max.toString(),
                        axisLine: {
                            show: false,
                            lineStyle: {
                            color: 'white'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                            color: 'rgba(255,255,255,0.3)'
                            }
                        },
                        axisLabel: {}
                    },
                    "dataZoom": [{
                        "show": true,
                        "height": 12,
                        "xAxisIndex": [
                            0
                        ],
                        bottom:'8%',
                        "start": 10,
                        "end": 90,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '110%',
                        handleStyle:{
                            color:"#d3dee5",

                        },
                        textStyle:{
                            color:"#fff"
                        },
                        borderColor:"#90979c"
                    }, {
                        "type": "inside",
                        "show": true,
                        "height": 15,
                        "start": 1,
                        "end": 35
                    }],
                    series: [{
                        name: '损失KM',
                        type: 'bar',
                        barWidth: '15%',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#fccb05'
                                }, {
                                    offset: 1,
                                    color: '#f5804d'
                                }]),
                                barBorderRadius: 12,
                            },
                        },
                        data: data
                    }]
                };
                // 绘制图表
                armyLossDiagram.setOption(option);
            })
        },

        getPaymentAllTypeLoss(){
            this.$request.get("/loss/getPaymentAllTypeLoss",{
                pid:this.paymentInfo.id
            }).then(res=>{
                console.log("loss",res.obj);
                if(window.shipTypeLossDiagram){
                    window.shipTypeLossDiagram.dispose(); // 销毁实例
                }
                window.shipTypeLossDiagram = echarts.init(document.getElementById('ship_type_count'));

                let category = [];
                let data = [];
                let sortData = [];
                for(let shipType in res.obj){
                    category.push(shipType);
                    data.push(res.obj[shipType]);
                    sortData.push(res.obj[shipType]);
                }
                sortData.sort();
                let max = parseInt(sortData[sortData.length-1]/100000000)*100000000+1000000000;

                let option = {
                    backgroundColor:'#323a5e',
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                        },
                        grid: {
                            left: '2%',
                            right: '4%',
                            bottom: '14%',
                            top:'16%',
                            containLabel: true
                        },
                        legend: {
                        data: ['损失KM'],
                        right: 10,
                        top:12,
                        textStyle: {
                            color: "#fff"
                        },
                        itemWidth: 12,
                        itemHeight: 10,
                        // itemGap: 35
                    },
                    xAxis: {
                        type: 'category',
                        data: category,
                        axisLine: {
                            lineStyle: {
                            color: 'white'

                            }
                        },
                        axisLabel: {
                            // interval: 0,
                            // rotate: 40,
                            textStyle: {
                            fontFamily: 'Microsoft YaHei'
                            }
                        },
                    },
                    yAxis: {
                        type: 'value',
                        max: max.toString(),
                        axisLine: {
                            show: false,
                            lineStyle: {
                            color: 'white'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                            color: 'rgba(255,255,255,0.3)'
                            }
                        },
                        axisLabel: {}
                    },
                    "dataZoom": [{
                        "show": true,
                        "height": 12,
                        "xAxisIndex": [
                            0
                        ],
                        bottom:'8%',
                        "start": 10,
                        "end": 90,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '110%',
                        handleStyle:{
                            color:"#d3dee5",

                        },
                        textStyle:{
                            color:"#fff"
                        },
                        borderColor:"#90979c"
                    }, {
                        "type": "inside",
                        "show": true,
                        "height": 15,
                        "start": 1,
                        "end": 35
                    }],
                    series: [{
                        name: '损失KM',
                        type: 'bar',
                        barWidth: '15%',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#8bd46e'
                                }, {
                                    offset: 1,
                                    color: '#09bcb7'
                                }]),
                                barBorderRadius: 11,
                            }
                        },
                        data: data
                    }]
                };
                // 绘制图表
                shipTypeLossDiagram.setOption(option);
            })
        },

        handleNodeClick(data,node){
            if(node.level!=2)return;
            this.getPaymentArmyLoss(data.id);
        },

        getPaymentArmyLoss(armyId){
            this.$request.post("/loss/getPaymentArmyLoss",{
                paymentId:this.paymentInfo.id,
                armyId:armyId
            }).then(res=>{
                this.armyLossList = res.obj;

                // for(let item of this.armyLossList){
                //     for(let standardShip of this.paymentShipList){
                //         if(item.shipName == standardShip.name){
                //             item.price = standardShip.price;
                //             break;
                //         }
                //     }
                // }
                console.log("this.armyLossList",this.armyLossList);
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
        },

        thousandBitSeparator(str){ 
            str = String(str);
            if (str.indexOf('.')>=0) {
                var postfix = str.substring(str.indexOf('.'));
                str = str.substring(0,str.indexOf('.'));
            }else{
                var postfix = '';
            };
            // console.log(postfix);
            // .99
            // console.log(str);
            // 9999999999999
            var iNum = str.length % 3; 
            var prev = ''; 
            var iNow = 0; 
            var temp = ''; 
            var arr = []; 
            if (iNum != 0){ 
                prev = str.substring(0, iNum); 
                arr.push(prev); 
            } 
            str = str.substring(iNum); 
            for (var i = 0; i < str.length; i++){ 
                iNow++; 
                temp += str[i]; 
                if (iNow == 3 && temp){ 
                arr.push(temp); 
                temp = ''; 
                iNow = 0; 
                } 
            } 
            // console.log(arr);
            // ["9", "999", "999", "999", "999"]
            return arr.join(',') + postfix; 
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
            height:calc(100% - 40px);
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
                                    text-align: right;
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
}
</style>