<template>
<div class="armyFillLoss">
    <div class="action-board">
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
                    <el-button type="primary" size="small" @click="checkDetail(scope.row.id)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="bottom-board">
          <el-pagination :page-size="filter.pageSize" layout="prev, pager, next" :total="filter.pageTotal" @current-change="filterAll"></el-pagination>
    </div>
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
        }
    },
    mounted(){
        this.filterAll();
    },
    methods:{
        copyLink(id){
            let url = "http://"+window.location.host+"/unionManagement/#/reportPayment?pid="+id;
            copyText(url);
            ElMessage({
                message: '补损链接已复制到剪贴板',
                type: 'success'
            })
        },
        checkDetail(id){
            this.$router.push({
                path:"/home/armyFilllossDetail",
                query:{
                    pid:id
                }
            });
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
.armyFillLoss{
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

.el-table .out-of-date{
    color:red;
}
</style>