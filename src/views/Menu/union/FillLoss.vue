<template>
<div class="fill-loss">
    <div class="action-board">
        <el-button type="primary" @click="">新建补损</el-button>
        <el-button type="success" @click="openStandardPaymentModal" style="margin-right:240px;">补损标准</el-button>

        <el-date-picker v-model="filter.dateRange" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary" @click="" style="margin-left:20px">查询</el-button>
    </div>
    <div class="main-board">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="日期"/>
            <el-table-column prop="name" label="补损名"/>
            <el-table-column prop="endTime" label="截止时间"/>
            <el-table-column prop="state" label="状态"/>
            <el-table-column label="操作" width="300">
                <template #default="scope">
                    <!-- <span style="margin-left: 10px">{{ scope.row.date }}</span> -->
                    <el-button type="success" size="small" @click="copyLink">复制链接</el-button>
                    <el-button type="primary" size="small" @click="checkDetail">查看详情</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="bottom-board">
          <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000"></el-pagination>
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
                    <span style="margin-right:50px;font-weight:bolder">{{standardInfo.name}}</span>补损金额:  <el-input-number v-model="standardInfo.num" :min="1" size="small" controls-position="right"/>
                    <el-button type="primary" size="small" style="margin-left:50px;" @click="configStandardPayment">提交</el-button>
                </div>
                <div style="margin-top:10px;padding-left:30px;height:540px;">
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
                dateRange:[new Date(),new Date()]
            },

            tableData:[
                {
                date: '2016-05-03',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
                },
                {
                date: '2016-05-02',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
                },
                {
                date: '2016-05-04',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
                },
                {
                date: '2016-05-01',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
                },
                {
                date: '2016-05-01',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
                },
                {
                date: '2016-05-01',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
                },
                {
                date: '2016-05-01',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
                },
                {
                date: '2016-05-01',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
                }
            ]
        }
    },
    mounted(){
        this.getShipTree();
    },
    methods:{
        checkDetail(){
            this.$router.push("/home/filllossDetail");
        },

        copyLink(){
            copyText("123");
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
</style>