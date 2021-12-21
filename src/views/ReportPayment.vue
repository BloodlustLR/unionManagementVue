<template>
<div class="reportPayment">
    <div class="header">
        <div class="title">
            {{paymentInfo.name}}
        </div>
        <div class="header-right">
            <el-dropdown trigger="click">
                <svg class="icon" width="30" height="30" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-365b8594="" style="margin-top:15px;margin-right:10px"><path fill="white" d="M176 416a112 112 0 100 224 112 112 0 000-224m0 64a48 48 0 110 96 48 48 0 010-96zm336-64a112 112 0 110 224 112 112 0 010-224zm0 64a48 48 0 100 96 48 48 0 000-96zm336-64a112 112 0 110 224 112 112 0 010-224zm0 64a48 48 0 100 96 48 48 0 000-96z"></path></svg>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="detailModal=true">补损详情</el-dropdown-item>
                    <el-dropdown-item @click="submit">提交</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <div class="list">
        <div v-for="(detectResult,key,index) in detectResultList" :key="index" class="list-item">
            <el-card class="box-card" style="height:220px;width:90%;margin:10px auto;text-align:left">
                <div class="report-item">编号: {{detectResult.reportId}}</div>
                <div class="report-item">时间: {{detectResult.reportTime}}</div>
                <div class="report-item">军团简称: {{detectResult.armyShortName}}</div>
                <div class="report-item">角色名: {{detectResult.gameId}}</div>
                <div class="report-item">舰船名: {{detectResult.shipName}}</div>
                <div class="report-item">星域: {{detectResult.area}}</div>
                <div class="report-item">星座: {{detectResult.constellation}}</div>
                <div class="report-item">星系: {{detectResult.galaxy}}</div>
                <div class="report-item">金额: {{detectResult.money}}</div>
                <div class="report-item">最后一击: {{detectResult.kmShip}}</div>
                <div class="report-item">最高伤害: {{detectResult.highATKShip}}</div>

                <div class="box-remove" @click="removeResult(detectResult.reportId)">X</div>
                <div class="box-info">
                    <div v-if="detectResult.info">{{detectResult.info}}</div>
                    <div style="margin-top:10px">
                        <el-button type="warning" size="mini" @click="openModifyModal(detectResult)">修改</el-button>
                        <el-button type="primary" size="mini" @click="openImgModal(detectResult.img)">查看截图</el-button>
                    </div>
                </div>
            </el-card>
        </div>
        <div style="margin-top:10px;">
            <el-upload v-if="!hasOutOfDate" accept="image/jpeg,image/png" :action="uploadUrl" :on-success="handleSuccess" :before-upload="beforeUpload" :show-file-list="false" drag multiple>
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
            <span v-if="hasOutOfDate">此次补损已截止</span>
        </div>
        <div style="height:50px;width:100%;"></div>
        <div class="sumbit-button" @click="submit">
            提交
        </div>
    </div>

    <el-dialog v-model="detailModal" title="补损详情" width="80%">
        <div class="payment-box">
            <div class="payment-item">补损编号-{{paymentInfo.id}}</div>
            <div class="payment-item">补损名-{{paymentInfo.name}}</div>
            <div class="payment-item">允许时间段-{{paymentInfo.lossStartTime}}<span v-show="paymentInfo.lossStartTime!=null&&paymentInfo.lossEndTime!=null">至</span>{{paymentInfo.lossEndTime}}</div>
            <div class="payment-item">允许星域-{{paymentInfo.limitArea}}</div>
            <div class="payment-item">允许星座-{{paymentInfo.limitConstellation}}</div>
            <div class="payment-item">允许星系-{{paymentInfo.limitGalaxy}}</div>
            <div class="payment-item">截止时间-{{paymentInfo.endTime}}</div>
        </div>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="detailModal = false">关闭</el-button>
        </span>
        </template>
    </el-dialog>

    <el-dialog v-model="modifyModal" title="补损详情" width="80%">
        <div class="modify-box">
            <div class="modify-item">
                <span style="margin-right:10px">时间</span>
                <el-date-picker v-model="lossInfo.reportTime" type="datetime" placeholder="请选择损失时间" disabled></el-date-picker>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">军团简称</span>
                <el-select v-model="lossInfo.armyShortName" placeholder="请选择军团简称" style="width:220px" filterable>
                    <el-option v-for="item in armyList" :key="item.shortName" :label="item.shortName" :value="item.shortName"></el-option>
                </el-select>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">角色名</span>
                <el-input v-model="lossInfo.gameId" placeholder="请输入角色名" style="width:220px"/>
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

    <el-dialog v-model="imgModal" title="截图" width="80%">
        <img :src="imgSrc" style="width:100%;height:100%;"/>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="imgModal = false">关闭</el-button>
        </span>
        </template>
    </el-dialog>

</div>
</template>
<script>
import { defineComponent, h } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { reactive } from "vue";

export default {
    data(){
        return{
            armyList:[],
            shipList:[],
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
            detectResultList:reactive({}),

            detailModal:false,
            modifyModal:false,
            lossInfo:{
                reportId:null,
                reportTime:null,
                armyShortName:'',
                gameId:'',
                shipName:'',
                area:'',
                constellation:'',
                galaxy:'',
                money:'',
                kmShip:'',
                highATKShip:''
            },
            imgSrc:'',
            imgModal:false
        }
    },
    created(){
        this.paymentInfo.id = this.$route.query.pid;
        this.getAllArmy();
        this.getAllShip();
    },
    mounted(){
        if(this.paymentInfo.id!=null){
            this.getPaymentInfo();
        }
    },
    methods:{
        getAllArmy(){
            this.$request.get("/army/getAllArmy").then(res =>{
                console.log(res.obj);
                this.armyList = res.obj;
            })
        },

        getAllShip(){
            this.$request.get("/ship/getAllShip").then(res =>{
                console.log(res.obj);
                this.shipList = res.obj;
            })
        },


        openModifyModal(value){
            console.log(value);
            this.lossInfo.reportId = value.reportId;
            this.lossInfo.reportTime = value.reportTime==null?null:new Date(value.reportTime);
            this.lossInfo.armyShortName = value.armyShortName;
            this.lossInfo.gameId = value.gameId;
            this.lossInfo.shipName = value.shipName;
            this.lossInfo.area = value.area;
            this.lossInfo.constellation = value.constellation;
            this.lossInfo.galaxy = value.galaxy;
            this.lossInfo.money = Number(value.money);
            this.lossInfo.kmShip = value.kmShip;
            this.lossInfo.highATKShip = value.highATKShip;
            this.modifyModal = true;
        },

        modifyData(){
            this.detectResultList[this.lossInfo.reportId].reportTime = this.lossInfo.reportTime.format("yyyy-MM-dd hh:mm:ss");
            this.detectResultList[this.lossInfo.reportId].armyShortName = this.lossInfo.armyShortName;
            this.detectResultList[this.lossInfo.reportId].gameId = this.lossInfo.gameId;
            this.detectResultList[this.lossInfo.reportId].shipName = this.lossInfo.shipName;
            this.detectResultList[this.lossInfo.reportId].area = this.lossInfo.area;
            this.detectResultList[this.lossInfo.reportId].constellation = this.lossInfo.constellation;
            this.detectResultList[this.lossInfo.reportId].galaxy = this.lossInfo.galaxy;
            this.detectResultList[this.lossInfo.reportId].money = this.lossInfo.money;
            this.detectResultList[this.lossInfo.reportId].kmShip = this.lossInfo.kmShip;
            this.detectResultList[this.lossInfo.reportId].highATKShip = this.lossInfo.highATKShip;
            this.detectResultList[this.lossInfo.reportId].isModify = true;
            this.modifyModal = false;
        },

        openImgModal(imgSrc){
            this.imgSrc = imgSrc;
            this.imgModal = true;
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

                this.hasOutOfDate = new Date().getTime()>new Date(this.paymentInfo.endTime).getTime();

                console.log(this.paymentInfo);

                this.detailModal = true;
            })
        },
        
        beforeUpload(file){
            let isJPG = file.type === 'image/jpeg';
            let isPNG = file.type === 'image/png';

            if(!isJPG&&!isPNG){
                ElMessage.error('只可以上传JPG或PNG图像');
            }

            return isJPG || isPNG;
        },

        handleSuccess(response, file, fileList){
            console.log(response);

            if(isEmpty(response.obj.reportId)){
                ElMessage.error('识别结果缺失报告编号，请换一张图试试');
                return;
            }
            // if(isEmpty(response.obj.gameId)&&isEmpty(response.obj.armyShortName)){
            //     ElMessage.error('识别结果缺失身份信息，请换一张图试试');
            //     return;
            // }
            // if(isEmpty(response.obj.shipName)){
            //     ElMessage.error('识别结果缺失舰船名，请换一张图试试');
            //     return;
            // }

            if(!isEmpty(this.paymentInfo.lossStartTime)){
                if(!isEmpty(response.obj.reportTime)){
                    let lossStartTime = new Date(this.paymentInfo.lossStartTime).getTime();

                    let reportTime = new Date(response.obj.reportTime).getTime();

                    if(reportTime<lossStartTime){
                        ElMessage.error('时间不合规');
                        return;
                    }

                }else{
                    ElMessage.error('识别结果缺失时间，请换一张图试试');
                    return;
                }
            }

            if(!isEmpty(this.paymentInfo.lossEndTime)){
                if(!isEmpty(response.obj.reportTime)){
                    let lossEndTime = new Date(this.paymentInfo.lossEndTime).getTime();

                    let reportTime = new Date(response.obj.reportTime).getTime();

                    if(reportTime>lossEndTime){
                        ElMessage.error('时间不合规');
                        return;
                    }
                }else{
                    ElMessage.error('识别结果缺失时间，请换一张图试试');
                    return;
                }
            }

            if(!isEmpty(this.paymentInfo.limitArea)){
                if(!isEmpty(response.obj.area)){
                    if(this.paymentInfo.limitArea.indexOf(response.obj.area)==-1){
                        ElMessage.error('星域不合规');
                        return;
                    }
                }else{
                    ElMessage.error('识别结果缺失星域，请换一张图试试');
                    return;
                }
            }

            // if(!isEmpty(this.paymentInfo.constellation)){
            //     if(!isEmpty(response.obj.constellation)){
            //         if(this.paymentInfo.limitConstellation.indexOf(response.obj.constellation)==-1){
            //             ElMessage.error('星域不合规');
            //             return;
            //         }
            //     }else{
            //         ElMessage.error('识别结果缺失星域，请换一张图试试');
            //         return;
            //     }
            // }


            // if(!isEmpty(this.paymentInfo.limitGalaxy)){
            //     if(!isEmpty(response.obj.galaxy)){
            //         if(this.paymentInfo.limitGalaxy.indexOf(response.obj.galaxy)==-1){
            //             ElMessage.error('星系不合规');
            //             return;
            //         }
            //     }else{
            //         ElMessage.error('识别结果缺失星系，请换一张图试试');
            //         return;
            //     }
            // }
            response.obj.info = undefined;
            response.obj.isModify = false;
            response.obj.paymentId = this.paymentInfo.id;
            this.detectResultList[response.obj.reportId]=response.obj;
        },

        removeResult(reportId){
            delete this.detectResultList[reportId];
        },

        submit(){
            this.$request.post("/loss/addLoss",this.detectResultList).then(res=>{
                let count = 0;
                for(let key in res.obj){
                    count++;
                }
                if(count==0){
                    ElMessage({
                        message: '上报成功',
                        type: 'success',
                    })
                    this.detectResultList = {};
                }else{
                    ElMessage({
                        message: '部分上报失败的内容已返回',
                        type: 'warning',
                    })
                    this.detectResultList = res.obj;
                }
                
            });
        }
    }

}
/**
 * 判断数据是否为空
 * @param value 需要验证的数据
 * @returns {boolean}
 */
function isEmpty(value) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value.toString().trim().length === 0
  ) {
    return true;
  } else {
    return false;
  }
}
</script>
<style lang="less">
.reportPayment{
    height:100%;
    width:100%;
    text-align: center;

    .payment-box{
        text-align: left;

        .payment-item{
            height:20px;
            line-height:20px;
        }
    }

    .report-box{
        margin-top:50px;
        text-align: left;


        .report-item{
            height:20px;
            line-height:20px;
        }
    }

    .modify-box{

        .modify-item{
            height:45px;
            line-height:45px;
        }
    }


    .header{
        height:60px;
        line-height: 60px;
        width:100%;
        background-color: rgb(64, 134, 226);
        color:white;
        position: relative;

        .title{
            margin:0 auto;
        }

        .header-right{
            position:absolute;
            right:0;
            top:0;
        }

        .header-right:hover{
            cursor: pointer;
        }

    }

    .list{
        height: calc(100% - 30px);
        overflow-y: scroll;
        background-color: rgb(236,240,245);
        

        .list-item{
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
        }

        .sumbit-button{
            position:fixed;
            color:white;
            bottom:20px;
            right:20px;
            height:80px;
            line-height:80px;
            width:80px;
            border-radius: 40px;
            background-color: rgb(64,134,226);
        }

        .sumbit-button:hover{
            cursor: pointer;
        }
    }
}
</style>