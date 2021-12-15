<template>
<div class="fill-loss">
    <div class="action-board">
        <el-button type="primary" @click="openAddPaymentModal">新建补损</el-button>
        <el-button type="success" @click="openStandardPaymentModal" style="margin-right:240px;">补损标准</el-button>

        发布日期:<el-date-picker v-model="filter.dateRange" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期" style="margin-left:10px"></el-date-picker>
        <el-button type="primary" @click="filterAll" style="margin-left:20px">查询</el-button>
    </div>
    <div class="main-board">
        <el-table :data="tableData" :row-class-name="rowClass" style="width: 100%">
            <el-table-column prop="id" label="编号" width="100"/>
            <el-table-column prop="createTime" label="发布日期"/>
            <el-table-column prop="name" label="补损名"/>
            <el-table-column prop="endTime" label="截止时间"/>
            <el-table-column label="操作" width="300">
                <template #default="scope">
                    <el-button type="success" size="small" @click="copyLink(scope.row.id)">复制链接</el-button>
                    <el-button type="primary" size="small" @click="checkDetail">查看详情</el-button>
                    <el-button type="danger" size="small" @click="removePayment(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="bottom-board">
          <el-pagination :page-size="filter.pageSize" layout="prev, pager, next" :total="filter.pageTotal" @current-change="filterAll"></el-pagination>
    </div>

    <el-dialog v-model="standardModal" title="补损标准" width="1200px" :close-on-click-modal="false">
        <div style="height:500px;width:1100px;margin:0 auto">
            <div style="float:left;height:498px;width:198px;border:1px solid black;">
                <div style="height:calc(100% - 40px);width:100%;overflow-y:auto;">
                    <div v-for="(item,index) in standardList" :key="index" class="standard-item" @click="loadStandard(item)">{{item.name}}</div>
                </div>
                <div style="height:40px;line-height:40px;width:100%;text-align:center;">
                    <el-button type="success" size="mini" @click="addStandardPayment">新建标准</el-button>
                </div>
            </div>
            <div style="float:right;height:500px;width:900px;" v-show="standardInfo.id!=null">
                <div style="padding-left:30px;height:59px;line-height:59px;border-bottom:1px solid black">
                    <span style="margin-right:50px;font-weight:bolder">{{standardInfo.name}}</span>补损星币:  <el-input-number v-model="standardInfo.num" :min="1" size="small" controls-position="right" style="width:160px"/>
                    <el-button type="primary" size="small" style="margin-left:50px;" @click="configStandardPayment">提交</el-button>
                    <el-button type="danger" size="small" style="margin-left:50px;" @click="removeStandardPayment">删除</el-button>
                </div>
                <div style="margin-top:10px;padding-left:30px;height:440px;overflow-y:auto">
                    <el-tree ref="shipTree" node-key="id" :data="shipTree" show-checkbox @check-change="handleCheckChange"/>
                </div>
            </div>
            <div class="clear"></div>
        </div>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="standardModal = false">关闭</el-button>
        </span>
        </template>
    </el-dialog>

    <el-dialog v-model="addPaymentModal" title="新建补损" width="800px" :close-on-click-modal="false">
        <div style="height:500px;overflow-y:auto;">
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                补损名称:<el-input v-model="addPaymentInfo.name" placeholder="请输入补损名称" style="width:400px;margin-left:10px;"/>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                截止时间:<el-date-picker v-model="addPaymentInfo.endTime" type="datetime" placeholder="请选择截止时间" style="width:200px;margin-left:10px;"></el-date-picker>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                补损标准:<el-select v-model="addPaymentInfo.standardList" placeholder="选择要使用的补损标准" style="width:400px;margin-left:10px;" filterable multiple>
                            <el-option v-for="(item,index) in standardList" :key="'standard_'+index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制时间:<el-switch v-model="addPaymentInfo.hasLimitTime" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
            </div>
            <div v-show="addPaymentInfo.hasLimitTime" style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                <el-date-picker v-model="addPaymentInfo.limitTime" type="datetimerange" range-separator="至" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制地区:<el-switch v-model="addPaymentInfo.hasLimitArea" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
                <div v-show="addPaymentInfo.hasLimitArea" class="element-add" @click="addPaymentInfo.limitAreaList.push('')">+</div>
            </div>
            <div v-show="addPaymentInfo.hasLimitArea" style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                <div v-for="(item,index) in addPaymentInfo.limitAreaList" :key="'area_'+index" style="display:inline-block;vertical-align:middle">
                    <el-input v-model="addPaymentInfo.limitAreaList[index]" placeholder="请输入地区名" size="mini" style="width:120px;margin-left:10px;"/>
                    <div class="element-remove" @click="addPaymentInfo.limitAreaList.splice(index,1)">x</div>
                </div>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制星域:<el-switch v-model="addPaymentInfo.hasLimitConstellation" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
                <div v-show="addPaymentInfo.hasLimitConstellation" class="element-add" @click="addPaymentInfo.limitConstellationList.push('')">+</div>
            </div>
            <div v-show="addPaymentInfo.hasLimitConstellation" style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                <div v-for="(item,index) in addPaymentInfo.limitConstellationList" :key="'area_'+index" style="display:inline-block;vertical-align:middle">
                    <el-input v-model="addPaymentInfo.limitConstellationList[index]" placeholder="请输入星域名" size="mini" style="width:120px;margin-left:10px;"/>
                    <div class="element-remove" @click="addPaymentInfo.limitConstellationList.splice(index,1)">x</div>
                </div>
            </div>
            <div style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                限制星系:<el-switch v-model="addPaymentInfo.hasLimitGalaxy" active-color="#13ce66" inactive-color="#ff4949" style="margin-left:10px"/>
                <div v-show="addPaymentInfo.hasLimitGalaxy" class="element-add" @click="addPaymentInfo.limitGalaxyList.push('')">+</div>
            </div>
            <div v-show="addPaymentInfo.hasLimitGalaxy" style="width:600px;margin:0 auto;text-align:left;height:60px;line-height:60px">
                <div v-for="(item,index) in addPaymentInfo.limitGalaxyList" :key="'area_'+index" style="display:inline-block;vertical-align:middle">
                    <el-input v-model="addPaymentInfo.limitGalaxyList[index]" placeholder="请输入星系名" size="mini" style="width:120px;margin-left:10px;"/>
                    <div class="element-remove" @click="addPaymentInfo.limitGalaxyList.splice(index,1)">x</div>
                </div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addPaymentModal = false">取消</el-button>
                <el-button type="primary" @click="addPayment">新增</el-button>
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

            standardModal:false,
            standardInfo:{
                id:null,
                name:'',
                num:0,
                shipList:[]
            },
            standardList:[],
            shipTree:[],


            filter:{
                dateRange:[],
                pageNum:1,
                pageSize:10,
                pageTotal:0
            },

            tableData:[],

            addPaymentModal:false,
            addPaymentInfo:{
                name:'',
                endTime:new Date(),
                standardList:[],
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
    created(){
        this.getShipTree();
    },
    mounted(){
        this.filterAll();
    },
    methods:{
        checkDetail(){
            this.$router.push("/home/filllossDetail");
        },

        copyLink(id){

            console.log();

            let url = window.location.host+"/#/reportPayment?pid="+id;

            copyText(url);
            ElMessage({
                message: '补损链接已复制到剪贴板',
                type: 'success'
            })
        },

        getStandardPayment(){
            this.$request.get("/standardPayment/getAllStandardPayment").then(res => {
                console.log(res.obj);
                this.standardList = res.obj;
            })
        },

        getShipTree(){
            this.$request.get("/ship/getShipTree").then(res => {
                console.log(res.obj);
                this.shipTree = res.obj;
                this.getStandardPayment();
            })
        },

        filterAll(pageNum){
            if(pageNum&&typeof pageNum === 'number'){
                this.filter.pageNum = pageNum;
            }
            this.$request.post("/payment/pagePayment",this.filter).then(res =>{
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

        openAddPaymentModal(){
            this.addPaymentInfo={
                name:'',
                endTime:new Date(),
                standardList:[],
                hasLimitTime:false,
                limitTime:[new Date(),new Date()],
                hasLimitArea:false,
                limitAreaList:[''],
                hasLimitConstellation:false,
                limitConstellationList:[''],
                hasLimitGalaxy:false,
                limitGalaxyList:['']
            }
            this.addPaymentModal = true;
        },

        addPayment(){
            if(isEmpty(this.addPaymentInfo.name)||this.addPaymentInfo.standardList.length==0){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }

            //整理地区
            let limitAreaList = [];
            for(let item of this.addPaymentInfo.limitAreaList){
                if(!isEmpty(item)){
                    limitAreaList.push(item);
                }
            }
            this.addPaymentInfo.limitAreaList = limitAreaList;

            //整理星域
            let limitConstellationList = [];
            for(let item of this.addPaymentInfo.limitConstellationList){
                if(!isEmpty(item)){
                    limitConstellationList.push(item);
                }
            }
            this.addPaymentInfo.limitConstellationList = limitConstellationList;

            //整理星系
            let limitGalaxyList = [];
            for(let item of this.addPaymentInfo.limitGalaxyList){
                if(!isEmpty(item)){
                    limitGalaxyList.push(item);
                }
            }
            this.addPaymentInfo.limitGalaxyList = limitGalaxyList;

            this.$request.post("/payment/addPayment",this.addPaymentInfo).then(res =>{
                if(res.obj=="success"){
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    })
                    this.addPaymentModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('新增失败');
                }
            })
        },

        removePayment(id){
            ElMessageBox.confirm(
                '是否确认删除补损?',
                '删除补损',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.$request.post("/payment/removePayment",{
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


        openStandardPaymentModal(){
            this.standardInfo.id = null;
            this.standardInfo.num = 0;
            this.standardInfo.name = "";
            this.standardInfo.shipList = [];
            this.standardModal = true;
        },

        handleCheckChange(){
            let checked = this.$refs.shipTree.getCheckedNodes();
            let newChecked = [];
            for(let item of checked){
                if(!isNaN(Number(item.id))){
                    newChecked.push(item.id);
                }
            }
            this.standardInfo.shipList = newChecked;
            console.log(this.standardInfo.shipList);
        },

        addStandardPayment(){
            ElMessageBox.prompt('请输入你的补损标准名称', '新建补损标准', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                if(isEmpty(value)){
                    ElMessage({
                        message: '请先补全数据',
                        type: 'warning',
                    })
                    return;
                }
                this.$request.post("/standardPayment/addStandardPayment",{
                    name:value
                }).then(res =>{
                    if(res.obj=="success"){
                        ElMessage({
                            message: '新增成功',
                            type: 'success',
                        })
                        this.getStandardPayment();
                    }else{
                        ElMessage.error('新增失败');
                    }
                })
            }).catch(() => {

            })
        },

        loadStandard(value){
            this.resetTree();
            this.standardInfo.id = value.id;
            this.standardInfo.name = value.name;
            this.standardInfo.num = value.num;
            let shipList = [];
            for(let item of value.relatedShipList){
                shipList.push(item.id);
            }
            this.standardInfo.shipList = shipList;
            this.$refs.shipTree.setCheckedKeys(shipList);
        },

        configStandardPayment(){
            let data = {
                id:this.standardInfo.id,
                num:this.standardInfo.num,
                shipList:this.standardInfo.shipList
            }
            this.$request.post("/standardPayment/configStandardPayment",data).then(res =>{
                if(res.obj=="success"){
                    ElMessage({
                        message: '配置成功',
                        type: 'success',
                    })
                    this.getStandardPayment();
                }else{
                    ElMessage.error('配置失败');
                }
            })
        },

        removeStandardPayment(){
            ElMessageBox.confirm(
                '是否确认删除补损标准?',
                '删除舰船',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.$request.post("/standardPayment/removeStandardPayment",{
                    id:this.standardInfo.id
                }).then(res => {
                    if(res.obj=="success"){
                        ElMessage({
                            message: '删除成功',
                            type: 'success',
                        })
                    }else{
                        ElMessage.error('删除失败');
                    }
                    this.standardInfo.id = null;
                    this.standardInfo.num = 0;
                    this.standardInfo.name = "";
                    this.standardInfo.shipList = [];
                    this.resetTree();
                    this.getStandardPayment();
                })
            }).catch(() => {

            })
        },

        resetTree(){
            this.$refs.shipTree.setCheckedKeys([]);
        }
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
.fill-loss{
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
        height:calc(80% - 60px);
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

.standard-item{
    height:30px;
    line-height:30px;
    padding-left:20px;
}

.standard-item:hover{
    cursor: pointer;
    background-color: grey;
    color:white;
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