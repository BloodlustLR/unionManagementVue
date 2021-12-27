<template>
<div class="reportKill">
    <div class="header">
        <div class="title">
            {{killReportInfo.name}}
        </div>
        <div class="header-right">
            <el-dropdown trigger="click">
                <svg class="icon" width="30" height="30" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-365b8594="" style="margin-top:15px;margin-right:10px"><path fill="white" d="M176 416a112 112 0 100 224 112 112 0 000-224m0 64a48 48 0 110 96 48 48 0 010-96zm336-64a112 112 0 110 224 112 112 0 010-224zm0 64a48 48 0 100 96 48 48 0 000-96zm336-64a112 112 0 110 224 112 112 0 010-224zm0 64a48 48 0 100 96 48 48 0 000-96z"></path></svg>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="detailModal=true">击杀统计详情</el-dropdown-item>
                    <el-dropdown-item @click="applyArmyModal=true">批量修改军团</el-dropdown-item>
                    <el-dropdown-item @click="submit">提交</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <div class="list">
        <div v-for="(detectResult,index) in detectResultList" :key="index" class="list-item">
            <el-card class="box-card" style="height:240px;width:90%;margin:10px auto;text-align:left">
                <div class="report-item">时间: {{detectResult.reportTime}}</div>
                <div class="report-item">军团缩写: {{detectResult.kmArmyShortName}}</div>
                <div class="report-item">最后一击: {{detectResult.kmGameId}}</div>
                <div class="report-item">击杀船型: {{detectResult.shipName}}</div>
                <div class="report-item">星域: {{detectResult.area}}</div>
                <div class="report-item">星座: {{detectResult.constellation}}</div>
                <div class="report-item">星系: {{detectResult.galaxy}}</div>
                <div class="report-item">金额: {{thousandBitSeparator(detectResult.money)}}</div>

                <div class="box-remove" @click="removeResult(index)">X</div>
                <div class="box-info">
                    <div v-if="detectResult.info">{{detectResult.info}}</div>
                    <div style="margin-top:10px">
                        <el-button type="warning" size="mini" @click="openModifyModal(detectResult,index)">修改</el-button>
                        <el-button type="primary" size="mini" @click="openImgModal(detectResult.img)">查看截图</el-button>
                    </div>
                </div>
            </el-card>
        </div>

        <div v-for="(item,key,index) in loadingList" :key="index" class="list-item">
            <el-card class="box-card" style="height:220px;width:90%;margin:10px auto;text-align:left">
                <el-progress type="circle" :percentage="item" style="vertical-align:middle;margin-right:10%"/>
                <span>文件【{{key}}】解析中</span>
            </el-card>
        </div>
        <div style="margin-top:10px;">
            <el-upload v-if="!hasOutOfDate" accept="image/jpeg,image/png" :action="uploadUrl" :on-success="handleSuccess" :before-upload="beforeUpload" :show-file-list="false" :on-progress="uploadProgress" drag multiple>
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
            <span v-if="hasOutOfDate">此次统计已截止</span>
        </div>
        <div style="height:50px;width:100%;"></div>
        <div class="sumbit-button" @click="submit">
            提交
        </div>
    </div>

    <el-dialog v-model="detailModal" title="击杀统计详情" width="80%">
        <div class="killReport-box">
            <div class="killReport-item">击杀统计编号-{{killReportInfo.id}}</div>
            <div class="killReport-item">击杀统计名-{{killReportInfo.name}}</div>
            <div class="killReport-item">允许时间段-{{killReportInfo.killStartTime}}<span v-show="killReportInfo.killStartTime!=null&&killReportInfo.killEndTime!=null">至</span>{{killReportInfo.killEndTime}}</div>
            <div class="killReport-item">允许星域-{{killReportInfo.limitArea}}</div>
            <div class="killReport-item">允许星座-{{killReportInfo.limitConstellation}}</div>
            <div class="killReport-item">允许星系-{{killReportInfo.limitGalaxy}}</div>
            <div class="killReport-item">截止时间-{{killReportInfo.endTime}}</div>
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
                <el-date-picker v-model="killInfo.reportTime" type="datetime" placeholder="请选择损失时间" disabled></el-date-picker>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">军团简称</span>
                <el-select v-model="killInfo.armyShortName" placeholder="请选择军团简称" style="width:220px" filterable>
                    <el-option v-for="item in armyList" :key="item.shortName" :label="item.shortName" :value="item.shortName"></el-option>
                </el-select>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">角色名</span>
                <el-input v-model="killInfo.gameId" placeholder="请输入角色名" style="width:220px"/>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">舰船名</span>
                <el-select v-model="killInfo.shipName" placeholder="请选择舰船名" style="width:220px" filterable>
                    <el-option v-for="item in shipList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">星域</span>
                <el-input v-model="killInfo.area" placeholder="请输入星域" style="width:220px" disabled/>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">星座</span>
                <el-input v-model="killInfo.constellation" placeholder="请输入星座" style="width:220px"/>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">星系</span>
                <el-input v-model="killInfo.galaxy" placeholder="请输入星系" style="width:220px"/>
            </div>
            <div class="modify-item">
                <span style="margin-right:10px">金额</span>
                <el-input-number v-model="killInfo.money" :min="0" :step="1" :precision="0" step-strictly style="width:220px" :disabled="killInfo.money!=''&&killInfo.money!=null"/>
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

    <el-dialog v-model="applyArmyModal" title="批量修改军团" width="80%">
        <el-select v-model="applyArmyShortName" placeholder="请选择军团简称" style="width:220px" filterable>
            <el-option v-for="item in armyList" :key="item.shortName" :label="item.shortName" :value="item.shortName"></el-option>
        </el-select>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="applyArmy">修改</el-button>
            <el-button @click="applyArmyModal = false">关闭</el-button>
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
            hasOutOfDate:true,
            uploadUrl:'/api/ocr/detectPic',
            detectResultList:[],
            loadingList:reactive({}),

            detailModal:false,
            modifyModal:false,
            killInfo:{
                index:null,
                reportId:null,
                reportTime:null,
                armyShortName:'',
                gameId:'',
                shipName:'',
                area:'',
                constellation:'',
                galaxy:'',
                money:''
            },
            imgSrc:'',
            imgModal:false,
            
            applyArmyModal:false,
            applyArmyShortName:null
        }
    },
    created(){
        this.killReportInfo.id = this.$route.query.pid;
        this.getAllArmy();
        this.getAllShip();
    },
    mounted(){
        if(this.killReportInfo.id!=null){
            this.getKillReportInfo();
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


        openModifyModal(value,index){
            console.log(value);
            this.killInfo.index = index;
            this.killInfo.reportId = value.reportId;
            this.killInfo.reportTime = value.reportTime==null?null:new Date(value.reportTime);
            this.killInfo.armyShortName = value.kmArmyShortName;
            this.killInfo.gameId = value.kmGameId;
            this.killInfo.shipName = value.shipName;
            this.killInfo.area = value.area;
            this.killInfo.constellation = value.constellation;
            this.killInfo.galaxy = value.galaxy;
            this.killInfo.money = Number(value.money);
            this.modifyModal = true;
        },

        modifyData(){
            this.detectResultList[this.killInfo.index].reportTime = this.killInfo.reportTime.format("yyyy-MM-dd hh:mm:ss");
            this.detectResultList[this.killInfo.index].kmArmyShortName = this.killInfo.armyShortName;
            this.detectResultList[this.killInfo.index].kmGameId = this.killInfo.gameId;
            this.detectResultList[this.killInfo.index].shipName = this.killInfo.shipName;
            this.detectResultList[this.killInfo.index].area = this.killInfo.area;
            this.detectResultList[this.killInfo.index].constellation = this.killInfo.constellation;
            this.detectResultList[this.killInfo.index].galaxy = this.killInfo.galaxy;
            this.detectResultList[this.killInfo.index].money = this.killInfo.money;
            this.detectResultList[this.killInfo.index].isModify = true;
            this.modifyModal = false;
        },

        openImgModal(imgSrc){
            this.imgSrc = imgSrc;
            this.imgModal = true;
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

                this.hasOutOfDate = new Date().getTime()>new Date(this.killReportInfo.endTime).getTime();

                console.log(this.killReportInfo);

                this.detailModal = true;
            })
        },
        
        beforeUpload(file){
            let isJPG = file.type === 'image/jpeg';
            let isPNG = file.type === 'image/png';

            if(!isJPG&&!isPNG){
                ElMessage.error('只可以上传JPG或PNG图像');
            }
            this.loadingList[file.name] = 0;
            return isJPG || isPNG;
        },

        uploadProgress(event, file, fileList){
            this.loadingList[file.name] = Number((event.percent).toFixed(1));
            console.log(event, file, fileList);
        },

        handleSuccess(response, file, fileList){
            console.log(response);
            delete this.loadingList[file.name];

            let num = 0;
            let errorList = [];
            if(response.obj.dataType&&response.obj.dataType=="single"){
                let verifyResult = this.verifyDetect(response.obj);
                if(verifyResult==null){
                    response.obj.info = undefined;
                    response.obj.isModify = false;
                    response.obj.killReportId = this.killReportInfo.id;
                    this.detectResultList.push(response.obj);
                    num++;
                }else{
                    errorList.push("【"+response.obj.shipName+"】"+verifyResult);
                }
            }else if(response.obj.dataType&&response.obj.dataType=="multiple"){
                console.log(response.obj.list);
                for(let item of response.obj.list){
                    let verifyResult = this.verifyDetect(item);
                    if(verifyResult==null){
                        let detectResult = {
                            reportTime:item.reportTime,
                            shipName:item.shipName,
                            area:item.area,
                            constellation:item.constellation,
                            galaxy:item.galaxy,
                            kmArmyShortName:item.armyShortName,
                            kmGameId:item.gameId,
                            money:item.money,
                            info:undefined,
                            isModify:false,
                            killReportId:this.killReportInfo.id,
                            img:response.obj.img
                        }
                        this.detectResultList.push(detectResult);
                        num++;
                    }else{
                        errorList.push("【"+item.shipName+"】"+verifyResult);
                    }
                }
            }
            if(errorList.length==0){
                ElMessage({
                    message: '新增'+num+'条记录',
                    type: 'success',
                })
            }else{
                let errorInfo = '';
                for(let item of errorList){
                    errorInfo+=item+','
                }
                errorInfo = errorInfo.substring(0,errorInfo.length-1);
                ElMessage.error('新增'+num+'条记录,'+errorInfo);
            }

        },

        verifyDetect(value){
            // if(isEmpty(value.gameId)&&isEmpty(value.armyShortName)){
            //     ElMessage.error('识别结果缺失身份信息，请换一张图试试');
            //     return;
            // }
            // if(isEmpty(value.shipName)){
            //     ElMessage.error('识别结果缺失舰船名，请换一张图试试');
            //     return;
            // }

            if(!isEmpty(this.killReportInfo.killStartTime)){
                if(!isEmpty(value.reportTime)){
                    let killStartTime = new Date(this.killReportInfo.killStartTime).getTime();

                    let reportTime = new Date(value.reportTime).getTime();

                    if(reportTime<killStartTime){
                        // ElMessage.error('时间不合规');
                        // return false;
                        return '时间不合规';
                    }

                }else{
                    // ElMessage.error('识别结果缺失时间，请换一张图试试');
                    // return false;
                    return '识别结果缺失时间';
                }
            }

            if(!isEmpty(this.killReportInfo.killEndTime)){
                if(!isEmpty(value.reportTime)){
                    let killEndTime = new Date(this.killReportInfo.killEndTime).getTime();

                    let reportTime = new Date(value.reportTime).getTime();

                    if(reportTime>killEndTime){
                        // ElMessage.error('时间不合规');
                        // return false;
                        return '时间不合规';
                    }
                }else{
                    // ElMessage.error('识别结果缺失时间，请换一张图试试');
                    // return false;
                    return '识别结果缺失时间';
                }
            }

            if(!isEmpty(this.killReportInfo.limitArea)){
                if(!isEmpty(value.area)){
                    if(this.killReportInfo.limitArea.indexOf(value.area)==-1){
                        // ElMessage.error('星域不合规');
                        // return false;
                        return '星域不合规';
                    }
                }else{
                    // ElMessage.error('识别结果缺失星域，请换一张图试试');
                    // return false;
                    return '识别结果缺失星域';
                }
            }

            // if(!isEmpty(this.killReportInfo.constellation)){
            //     if(!isEmpty(value.constellation)){
            //         if(this.killReportInfo.limitConstellation.indexOf(value.constellation)==-1){
            //             ElMessage.error('星域不合规');
            //             return;
            //         }
            //     }else{
            //         ElMessage.error('识别结果缺失星域，请换一张图试试');
            //         return;
            //     }
            // }


            // if(!isEmpty(this.killReportInfo.limitGalaxy)){
            //     if(!isEmpty(value.galaxy)){
            //         if(this.killReportInfo.limitGalaxy.indexOf(value.galaxy)==-1){
            //             ElMessage.error('星系不合规');
            //             return;
            //         }
            //     }else{
            //         ElMessage.error('识别结果缺失星系，请换一张图试试');
            //         return;
            //     }
            // }
            // return true;
            return null;
        },

        removeResult(index){
            this.detectResultList.splice(index,1);
        },

        applyArmy(){
            for(let item of this.detectResultList){
                if(item.kmArmyShortName != this.applyArmyShortName){
                    item.kmArmyShortName = this.applyArmyShortName;
                    item.isModify = true;
                }
            }
            this.applyArmyModal = false;
        },

        submit(){
            this.$request.post("/kill/addKill",this.detectResultList).then(res=>{
                let count = 0;
                for(let key in res.obj){
                    count++;
                }
                if(count==0){
                    ElMessage({
                        message: '上报成功',
                        type: 'success',
                    })
                    this.detectResultList = [];
                }else{
                    ElMessage({
                        message: '部分上报失败的内容已返回',
                        type: 'warning',
                    })
                    this.detectResultList = res.obj;
                }
                
            });
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
.reportKill{
    height:100%;
    width:100%;
    text-align: center;


    .killReport-box{
        margin-top:50px;
        text-align: left;

        .killReport-item{
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
                    text-align: right;

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