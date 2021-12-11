<template>
<div class="fill-loss">
    <div class="action-board">
        <el-button type="primary" @click="">新建补损</el-button>
        <el-button type="success" @click="standardModal=true" style="margin-right:240px;">补损标准</el-button>

        <el-date-picker v-model="filter.dateRange" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary" @click="" style="margin-left:20px">查询</el-button>
    </div>
    <div class="main-board">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="日期"/>
            <el-table-column prop="name" label="补损名"/>
            <el-table-column prop="endTime" label="截止时间"/>
            <el-table-column label="操作" width="300">
                <template #default="scope">
                    <!-- <span style="margin-left: 10px">{{ scope.row.date }}</span> -->
                    <el-button type="primary" size="small">查看详情</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-model="standardModal" title="补损标准" width="1200px" :close-on-click-modal="false">
        <div style="height:500px;width:1100px;margin:0 auto">
            <div style="float:left;height:498px;width:198px;border:1px solid black;">
                <div style="height:calc(100% - 40px);width:100%;overflow-y:auto;">
                    <div v-for="(item,index) in standardList" :key="index" class="standard-item">{{item.name}}</div>
                </div>
                <div style="height:40px;line-height:40px;width:100%;text-align:center;">
                    <el-button type="success" size="mini">新建标准</el-button>
                </div>
            </div>
            <div style="float:right;height:500px;width:900px;">
                <div style="padding-left:30px;height:59px;line-height:59px;border-bottom:1px solid black">
                    补损金额:  <el-input-number v-model="standardInfo.num" :min="1" size="small" controls-position="right"/>
                </div>
                <div style="margin-top:10px;padding-left:30px;height:540px;">
                    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
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
export default {
    data(){
        return{

            standardModal:false,
            standardInfo:{
                num:10000
            },
            standardList:[
                {
                    id:1,
                    name:'T8战巡',
                    num:10000
                },
                {
                    id:1,
                    name:'T7战巡',
                    num:10000
                }
            ],


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
    methods:{

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
        height:calc(90% - 60px);
        width:90%;
        margin:0 auto;
        background-color: white;


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