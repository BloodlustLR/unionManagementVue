<template>
<div class="killCount">
    <div class="action-board">
        <el-button type="primary" @click="openAddKillReportModal" style="margin-right:100px;">新建击杀统计</el-button>
        发布日期:<el-date-picker v-model="filter.dateRange" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期" style="margin-left:10px"></el-date-picker>
        <el-button type="primary" @click="filterAll" style="margin-left:20px">查询</el-button>
    </div>
    <div class="main-board">
        <el-table :data="tableData" :row-class-name="rowClass" style="width: 100%">
            <el-table-column prop="id" label="编号" width="100"/>
            <el-table-column prop="createTime" label="发布日期"/>
            <el-table-column prop="name" label="击杀统计名"/>
            <el-table-column prop="endTime" label="截止时间"/>
            <el-table-column label="操作" width="400">
                <template #default="scope">
                    <el-button type="success" size="small" @click="copyLink(scope.row.id)">复制链接</el-button>
                    <el-button type="primary" size="small" @click="checkDetail(scope.row.id)">查看详情</el-button>
                    <el-button type="warning" size="small" @click="openConfigKillReportModal(scope.row)">配置</el-button>
                    <el-button type="danger" size="small" @click="removeKillReport(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="bottom-board">
          <el-pagination :page-size="filter.pageSize" layout="prev, pager, next" :total="filter.pageTotal" @current-change="filterAll"></el-pagination>
    </div>

    <el-dialog v-model="addKillReportModal" title="新建击杀统计" width="800px" :close-on-click-modal="false">
        <div style="height:500px;overflow-y:auto;">
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                击杀统计名称:<el-input v-model="addKillReportInfo.name" placeholder="请输入击杀统计名称" style="width:400px;margin-left:10px;"/>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                截止时间:<el-date-picker v-model="addKillReportInfo.endTime" type="datetime" placeholder="请选择截止时间" style="width:200px;margin-left:10px;"></el-date-picker>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制时间:<el-switch v-model="addKillReportInfo.hasLimitTime" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
            </div>
            <div v-show="addKillReportInfo.hasLimitTime" style="width:600px;margin:0 auto;text-align:left;">
                <el-date-picker v-model="addKillReportInfo.limitTime" type="datetimerange" range-separator="至" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制星域:<el-switch v-model="addKillReportInfo.hasLimitArea" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
                <div v-show="addKillReportInfo.hasLimitArea" class="element-add" @click="addKillReportInfo.limitAreaList.push('')">+</div>
            </div>
            <div v-show="addKillReportInfo.hasLimitArea" style="width:600px;margin:0 auto;text-align:left;">
                <div v-for="(item,index) in addKillReportInfo.limitAreaList" :key="'area_'+index" style="display:inline-block;vertical-align:middle">
                    <el-input v-model="addKillReportInfo.limitAreaList[index]" placeholder="请输入星域名" size="mini" style="width:120px;margin-left:10px;"/>
                    <div class="element-remove" @click="addKillReportInfo.limitAreaList.splice(index,1)">x</div>
                </div>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制星座:<el-switch v-model="addKillReportInfo.hasLimitConstellation" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
                <div v-show="addKillReportInfo.hasLimitConstellation" class="element-add" @click="addKillReportInfo.limitConstellationList.push('')">+</div>
            </div>
            <div v-show="addKillReportInfo.hasLimitConstellation" style="width:600px;margin:0 auto;text-align:left;">
                <div v-for="(item,index) in addKillReportInfo.limitConstellationList" :key="'area_'+index" style="display:inline-block;vertical-align:middle">
                    <el-input v-model="addKillReportInfo.limitConstellationList[index]" placeholder="请输入星座名" size="mini" style="width:120px;margin-left:10px;"/>
                    <div class="element-remove" @click="addKillReportInfo.limitConstellationList.splice(index,1)">x</div>
                </div>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制星系:<el-switch v-model="addKillReportInfo.hasLimitGalaxy" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
                <div v-show="addKillReportInfo.hasLimitGalaxy" class="element-add" @click="addKillReportInfo.limitGalaxyList.push('')">+</div>
            </div>
            <div v-show="addKillReportInfo.hasLimitGalaxy" style="width:600px;margin:0 auto;text-align:left;">
                <div v-for="(item,index) in addKillReportInfo.limitGalaxyList" :key="'area_'+index" style="display:inline-block;vertical-align:middle">
                    <el-input v-model="addKillReportInfo.limitGalaxyList[index]" placeholder="请输入星系名" size="mini" style="width:120px;margin-left:10px;"/>
                    <div class="element-remove" @click="addKillReportInfo.limitGalaxyList.splice(index,1)">x</div>
                </div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addKillReportModal = false">取消</el-button>
                <el-button type="primary" @click="addKillReport">新增</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="configKillReportModal" title="新建击杀统计" width="800px" :close-on-click-modal="false">
        <div style="height:500px;overflow-y:auto;">
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                击杀统计名称:<el-input v-model="configKillReportInfo.name" placeholder="请输入击杀统计名称" style="width:400px;margin-left:10px;"/>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                截止时间:<el-date-picker v-model="configKillReportInfo.endTime" type="datetime" placeholder="请选择截止时间" style="width:200px;margin-left:10px;"></el-date-picker>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制时间:<el-switch v-model="configKillReportInfo.hasLimitTime" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
            </div>
            <div v-show="configKillReportInfo.hasLimitTime" style="width:600px;margin:0 auto;text-align:left;">
                <el-date-picker v-model="configKillReportInfo.limitTime" type="datetimerange" range-separator="至" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制星域:<el-switch v-model="configKillReportInfo.hasLimitArea" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
                <div v-show="configKillReportInfo.hasLimitArea" class="element-add" @click="configKillReportInfo.limitAreaList.push('')">+</div>
            </div>
            <div v-show="configKillReportInfo.hasLimitArea" style="width:600px;margin:0 auto;text-align:left;">
                <div v-for="(item,index) in configKillReportInfo.limitAreaList" :key="'area_'+index" style="display:inline-block;vertical-align:middle">
                    <el-input v-model="configKillReportInfo.limitAreaList[index]" placeholder="请输入星域名" size="mini" style="width:120px;margin-left:10px;"/>
                    <div class="element-remove" @click="configKillReportInfo.limitAreaList.splice(index,1)">x</div>
                </div>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制星座:<el-switch v-model="configKillReportInfo.hasLimitConstellation" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
                <div v-show="configKillReportInfo.hasLimitConstellation" class="element-add" @click="configKillReportInfo.limitConstellationList.push('')">+</div>
            </div>
            <div v-show="configKillReportInfo.hasLimitConstellation" style="width:600px;margin:0 auto;text-align:left;">
                <div v-for="(item,index) in configKillReportInfo.limitConstellationList" :key="'area_'+index" style="display:inline-block;vertical-align:middle">
                    <el-input v-model="configKillReportInfo.limitConstellationList[index]" placeholder="请输入星座名" size="mini" style="width:120px;margin-left:10px;"/>
                    <div class="element-remove" @click="configKillReportInfo.limitConstellationList.splice(index,1)">x</div>
                </div>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制星系:<el-switch v-model="configKillReportInfo.hasLimitGalaxy" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
                <div v-show="configKillReportInfo.hasLimitGalaxy" class="element-add" @click="configKillReportInfo.limitGalaxyList.push('')">+</div>
            </div>
            <div v-show="configKillReportInfo.hasLimitGalaxy" style="width:600px;margin:0 auto;text-align:left;">
                <div v-for="(item,index) in configKillReportInfo.limitGalaxyList" :key="'area_'+index" style="display:inline-block;vertical-align:middle">
                    <el-input v-model="configKillReportInfo.limitGalaxyList[index]" placeholder="请输入星系名" size="mini" style="width:120px;margin-left:10px;"/>
                    <div class="element-remove" @click="configKillReportInfo.limitGalaxyList.splice(index,1)">x</div>
                </div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="configKillReportModal = false">取消</el-button>
                <el-button type="primary" @click="configKillReport">配置</el-button>
            </span>
        </template>
    </el-dialog>
</div>
</template>
<script>
import { ElMessageBox,ElMessage } from 'element-plus'

export default {
    data(){
        return{
            filter:{
                dateRange:[],
                pageNum:1,
                pageSize:10,
                pageTotal:0
            },

            tableData:[],

            addKillReportModal:false,
            addKillReportInfo:{
                name:'',
                endTime:new Date(),
                hasLimitTime:false,
                limitTime:[new Date(),new Date()],
                hasLimitArea:false,
                limitAreaList:[''],
                hasLimitConstellation:false,
                limitConstellationList:[''],
                hasLimitGalaxy:false,
                limitGalaxyList:['']
            },

            configKillReportModal:false,
            configKillReportInfo:{
                id:null,
                name:'',
                endTime:new Date(),
                hasLimitTime:false,
                limitTime:[new Date(),new Date()],
                hasLimitArea:false,
                limitAreaList:[''],
                hasLimitConstellation:false,
                limitConstellationList:[''],
                hasLimitGalaxy:false,
                limitGalaxyList:['']
            }
        }
    },
    mounted(){
        this.filterAll();
    },
    methods:{

        checkDetail(id){
            this.$router.push({
                path:"/home/killCountDetail",
                query:{
                    pid:id
                }
            });
        },
        
        copyLink(id){
            let url = "http://"+window.location.host+"/unionManagement/#/reportKill?pid="+id;
            copyText(url);
            ElMessage({
                message: '击杀上报链接已复制到剪贴板',
                type: 'success'
            })
        },

        filterAll(pageNum){
            if(pageNum&&typeof pageNum === 'number'){
                this.filter.pageNum = pageNum;
            }
            this.$request.post("/killReport/pageKillReport",this.filter).then(res =>{
                this.tableData = res.obj.records;
                this.filter.pageNum = res.obj.current;
                this.filter.pageSize = res.obj.size;
                this.filter.pageTotal = res.obj.total;
            })
        },

        rowClass({ row, rowIndex }){
            let nowTime = new Date().getTime();
            let endTime = new Date(row.endTime).getTime();
            console.log(nowTime>endTime);
            return nowTime>=endTime?'out-of-date':'';
        },

        openAddKillReportModal(){
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate()+1);
            tomorrow.setHours(18);
            tomorrow.setMinutes(0);
            tomorrow.setSeconds(0);

            this.addKillReportInfo={
                name:'',
                endTime:tomorrow,
                hasLimitTime:false,
                limitTime:[new Date(),new Date()],
                hasLimitArea:false,
                limitAreaList:[''],
                hasLimitConstellation:false,
                limitConstellationList:[''],
                hasLimitGalaxy:false,
                limitGalaxyList:['']
            }
            this.addKillReportModal = true;
        },

        addKillReport(){
            if(isEmpty(this.addKillReportInfo.name)){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }

            //整理地区
            let limitAreaList = [];
            for(let item of this.addKillReportInfo.limitAreaList){
                if(!isEmpty(item)){
                    limitAreaList.push(item);
                }
            }
            this.addKillReportInfo.limitAreaList = limitAreaList;

            //整理星域
            let limitConstellationList = [];
            for(let item of this.addKillReportInfo.limitConstellationList){
                if(!isEmpty(item)){
                    limitConstellationList.push(item);
                }
            }
            this.addKillReportInfo.limitConstellationList = limitConstellationList;

            //整理星系
            let limitGalaxyList = [];
            for(let item of this.addKillReportInfo.limitGalaxyList){
                if(!isEmpty(item)){
                    limitGalaxyList.push(item);
                }
            }
            this.addKillReportInfo.limitGalaxyList = limitGalaxyList;

            this.$request.post("/killReport/addKillReport",this.addKillReportInfo).then(res =>{
                if(res.obj=="success"){
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    })
                    this.addKillReportModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('新增失败');
                }
            })
        },

        openConfigKillReportModal(data){

            this.$request.get("/killReport/getKillReportInfo",{
                pid:data.id
            }).then(res=>{
                console.log('res',res);
                let killReportInfo = res.obj;

                this.configKillReportInfo={
                    id:killReportInfo.id,
                    name:killReportInfo.name,
                    endTime:new Date(killReportInfo.endTime),
                    hasLimitTime:killReportInfo.lossStartTime!=null&&killReportInfo.lossEndTime!=null,
                    limitTime:[new Date(killReportInfo.lossStartTime),new Date(killReportInfo.lossEndTime)],
                    hasLimitArea:killReportInfo.limitArea!=null,
                    limitAreaList:killReportInfo.limitArea==null?['']:JSON.parse(killReportInfo.limitArea),
                    hasLimitConstellation:killReportInfo.limitConstellation!=null,
                    limitConstellationList:killReportInfo.limitConstellation==null?['']:JSON.parse(killReportInfo.limitConstellation),
                    hasLimitGalaxy:killReportInfo.limitGalaxy!=null,
                    limitGalaxyList:killReportInfo.limitGalaxy==null?['']:JSON.parse(killReportInfo.limitGalaxy)
                }
                this.configKillReportModal = true;
            })
        },

        configKillReport(){
            if(isEmpty(this.configKillReportInfo.name)){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }

            //整理地区
            let limitAreaList = [];
            for(let item of this.configKillReportInfo.limitAreaList){
                if(!isEmpty(item)){
                    limitAreaList.push(item);
                }
            }
            this.configKillReportInfo.limitAreaList = limitAreaList;

            //整理星域
            let limitConstellationList = [];
            for(let item of this.configKillReportInfo.limitConstellationList){
                if(!isEmpty(item)){
                    limitConstellationList.push(item);
                }
            }
            this.configKillReportInfo.limitConstellationList = limitConstellationList;

            //整理星系
            let limitGalaxyList = [];
            for(let item of this.configKillReportInfo.limitGalaxyList){
                if(!isEmpty(item)){
                    limitGalaxyList.push(item);
                }
            }
            this.configKillReportInfo.limitGalaxyList = limitGalaxyList;

            this.$request.post("/killReport/configKillReport",this.configKillReportInfo).then(res =>{
                if(res.obj=="success"){
                    ElMessage({
                        message: '配置成功',
                        type: 'success',
                    })
                    this.configKillReportModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('配置失败');
                }
            })
        },


        removeKillReport(id){
            ElMessageBox.confirm(
                '是否确认删除击杀统计?',
                '删除击杀统计',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.$request.post("/killReport/removeKillReport",{
                    id:id
                }).then(res => {
                    if(res.obj=="success"){
                        ElMessage({
                            message: '删除成功',
                            type: 'success',
                        })
                    }else{
                        ElMessage.error('删除失败');
                    }
                    this.filterAll();
                })
            }).catch(() => {

            })
        },
    }
}

// 复制的方法
function copyText(text, callback){ // text: 要复制的内容， callback: 回调
    var tag = document.createElement('input');
    tag.setAttribute('id', 'cp_hgz_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('cp_hgz_input').select();
    document.execCommand('copy');
    document.getElementById('cp_hgz_input').remove();
    if(callback) {callback(text)}
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
.killCount{
    height:100%;
    width:100%;
    padding-top:20px;

    .action-board{
        height:60px;
        line-height: 60px;
        width:90%;
        margin:0 auto;
        
        >* {
            vertical-align: middle;
        }
    }

    .main-board{
        width:90%;
        margin:0 auto;
        background-color: white;
    }

    .bottom-board{
        height:60px;
        line-height:60px;
        width:90%;
        margin:0 auto;
        text-align: center;
    }
}

.element-add{
    font-size:14px;
    vertical-align:middle;
    display:inline-block;
    width:20px;
    height:16px;
    line-height:16px;
    background-color:rgb(131,205,94);
    color:white;
    text-align:center;
    margin-left:10px;
}

.element-remove{
    font-size:14px;
    vertical-align:middle;
    display:inline-block;
    width:20px;
    height:16px;
    line-height:16px;
    background-color:rgb(205, 94, 94);
    color:white;
    text-align:center;
    margin-right:20px;
}

.element-add,.element-remove{
    cursor: pointer;
}

.el-table .out-of-date{
    color:red;
}
</style>