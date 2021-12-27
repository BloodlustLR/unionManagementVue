<template>
<div class="killCountDetail">
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
                    <div class="killReport-box">
                        <div class="killReport-item" style="font-weight:bolder">补损编号- {{killReportInfo.id}}</div>
                        <div class="killReport-item" style="font-weight:bolder">补损名- {{killReportInfo.name}}</div>
                        <div class="killReport-item" style="font-weight:bolder">起始时间- {{killReportInfo.killStartTime}}</div>
                        <div class="killReport-item" style="font-weight:bolder">结束时间- {{killReportInfo.killEndTime}}</div>
                        <div class="killReport-item" style="font-weight:bolder">允许星域- {{killReportInfo.limitArea}}</div>
                        <div class="killReport-item" style="font-weight:bolder">允许星座- {{killReportInfo.limitConstellation}}</div>
                        <div class="killReport-item" style="font-weight:bolder">允许星系- {{killReportInfo.limitGalaxy}}</div>
                        <div class="killReport-item" style="font-weight:bolder">截止时间- {{killReportInfo.endTime}}</div>
                        <div class="killReport-item" style="font-weight:bolder;margin-top:20px">击杀总额:  {{Math.round(totalKill/100000000)}}亿星币</div>
                    </div>
                    <div class="army-box">
                        <el-tree :data="unionArmyList" :props="defaultProps"  @node-click="handleNodeClick"/>
                    </div>
                </div>
                <div class="detail-right">
                    <div class="army-info">军团击杀共计:{{Math.round(armyTotal/100000000)}}亿星币</div>
                    <div class="army-detail">
                        <div class="detail-item" v-for="(item,index) in armyKillList" :key="'armyLoss_'+index">
                            <el-card :class="{'box-card':true,'box-card-modify':item.isModify}" style="height:220px;width:90%;margin:10px auto;text-align:left">
                                <div class="report-item">编号: {{item.id}}</div>
                                <div class="report-item">击杀船型: {{item.shipName}}</div>
                                <div class="report-item">时间: {{item.killTime}}</div>
                                <div class="report-item">星域: {{item.area}}</div>
                                <div class="report-item">星座: {{item.constellation}}</div>
                                <div class="report-item">星系: {{item.galaxy}}</div>
                                <div class="report-item">金额: {{thousandBitSeparator(item.num)}}星币</div>

                                <div class="box-remove" @click="removeKill(index)">X</div>
                                <div class="box-info">
                                    <el-button type="primary" size="mini" @click="openImgModal(item.img)">查看截图</el-button>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </div>
            </div>
            <div class="count" v-if="displayType=='count'">
                <div id="army_rank" class="count-item"></div>
                <div id="area_count" class="count-item"></div>
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
            killReportInfo:{
                id:null,
                name:null,
                endTime:null,
                killStartTime:null,
                killEndTime:null,
                limitArea:[],
                limitConstellation:[],
                limitGalaxy:[]
            },
            totalKill:0,

            unionArmyList:[],
            defaultProps: {
                children: 'armyList',
                label: 'name',
            },

            armyKillList:[],
            imgModal:false,
            imgSrc:''
        }
    },
    computed:{
        armyTotal () {
            let total = 0;
            for(let armLoss of this.armyKillList){
                if(armLoss.num){
                    total+=armLoss.num;
                }
            }
            return total;
        }
    },
    created(){
        this.killReportInfo.id = this.$route.query.pid;
    },
    mounted(){
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
            this.getKillReportInfo();
            this.getKillReportTotal();
            this.getKillReportUnionArmy();
        },

        refreshAllDiagram(){
            this.getAllArmyRank();
            this.getAreaKill();
        },

        getAllArmyRank(){
            this.$request.get("/kill/getAllArmyRank",{
                pid:this.killReportInfo.id
            }).then(res=>{
                console.log("killRank",res.obj);
                if(window.armyRankDiagram){
                    window.armyRankDiagram.dispose(); // 销毁实例
                }
                window.armyRankDiagram = echarts.init(document.getElementById('army_rank'));// 再次创建实例

                let sortData = [];
                for(let armyName in res.obj){
                    sortData.push({
                        name:armyName,
                        num:Number(res.obj[armyName])
                    })
                }

                sortData.sort(compare("num"));
                console.log(sortData);
                let max = 1000000000;
                if(sortData.length>0){
                    max += parseInt(sortData[0].num/100000000)*100000000;
                }
                let category = [];
                let data = [];
                for(let item of sortData){
                    category.push(item.name);
                    data.push(item.num);
                }
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
                        data: ['击杀KM'],
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
                        name: '击杀KM',
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
                armyRankDiagram.setOption(option);
            })
        },

        getAreaKill(){
            this.$request.get("/kill/getAllAreaKill",{
                pid:this.killReportInfo.id
            }).then(res=>{
                if(window.areaKillDiagram){
                    window.areaKillDiagram.dispose(); // 销毁实例
                }
                window.areaKillDiagram = echarts.init(document.getElementById('area_count'));

                let category = [];
                let data = [];
                let sortData = [];
                for(let area in res.obj){
                    category.push(area);
                    data.push(res.obj[area]);
                    sortData.push(res.obj[area]);
                }
                sortData.sort();
                let max = 1000000000;
                if(sortData.length>0){
                    max += parseInt(sortData[sortData.length-1]/100000000)*100000000;
                }

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
                        data: ['击杀KM'],
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
                        name: '击杀KM',
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
                areaKillDiagram.setOption(option);
            })
        },

        getKillReportInfo(){
            this.$request.get("/killReport/getKillReportInfo",{
                pid:this.killReportInfo.id
            }).then(res=>{
                this.killReportInfo.name = res.obj.name;
                this.killReportInfo.endTime = res.obj.endTime;
                this.killReportInfo.killStartTime = res.obj.killStartTime;
                this.killReportInfo.killEndTime = res.obj.killEndTime;
                this.killReportInfo.limitArea = JSON.parse(res.obj.limitArea);
                this.killReportInfo.limitConstellation = JSON.parse(res.obj.limitConstellation);
                this.killReportInfo.limitGalaxy = JSON.parse(res.obj.limitGalaxy);
            })
        },

        getKillReportTotal(){
            this.$request.get("/killReport/getKillReportTotal",{
                pid:this.killReportInfo.id
            }).then(res=>{
                this.totalKill = res.obj.killTotal;
            })
        },

        getKillReportUnionArmy(){
            this.$request.get("/killReport/getKillReportUnionArmy",{
                pid:this.killReportInfo.id
            }).then(res=>{
                this.unionArmyList = res.obj;
                console.log(this.unionArmyList);
            })
        },

        handleNodeClick(data,node){
            if(node.level!=2)return;
            this.getKillReportArmyKill(data.id);
        },

        getKillReportArmyKill(armyId){
            this.$request.post("/kill/getKillReportArmyKill",{
                killReportId:this.killReportInfo.id,
                armyId:armyId
            }).then(res=>{
                this.armyKillList = res.obj;
                console.log("this.armyKillList",this.armyKillList);
            })
        },

        removeKill(index){
            ElMessageBox.confirm(
                '是否确认删除此击杀?',
                '删除击杀',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.$request.post("/kill/removeKill",{
                    id:this.armyKillList[index].id
                }).then(res => {
                    if(res.obj=="success"){
                        ElMessage({
                            message: '删除成功',
                            type: 'success',
                        })
                        this.armyKillList.splice(index,1);
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
//定义一个比较器--降序排列
function compare(propertyName) {
    console.log(propertyName)
    return function(object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if(value2 < value1) {
            return -1;
        } else if(value2 > value1) {
            return 1;
        } else {
            return 0;
        }
    }
}
</script>
<style lang="less">
.killCountDetail{
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

                    .killReport-box{
                        height:240px;
                        overflow-y: auto;
                        text-align: left;
                        padding-left: 20px;
                        

                        .killReport-item{
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
}
</style>