<template>
<div class="ship">
    <div class="action-board">

        <el-button type="success" @click="" style="margin-right:240px;">新增舰船</el-button>

        科技等级:
        <el-select v-model="filter.level" placeholder="选择科技等级" style="width:200px;margin-right:20px;" filterable>
            <el-option label="全部" value="0"></el-option>
            <el-option v-for="(item,index) in 10" :key="index" :label="'T'+item" :value="item"></el-option>
        </el-select>

        舰船类型:
        <el-select v-model="filter.type" placeholder="选择舰船类型" style="width:200px;margin-right:20px;" filterable>
            <el-option label="全部" value="全部"></el-option>
            <el-option label="护卫舰" value="护卫舰"></el-option>
            <el-option label="驱逐舰" value="驱逐舰"></el-option>
            <el-option label="巡洋舰" value="巡洋舰"></el-option>
            <el-option label="战列巡洋舰" value="战列巡洋舰"></el-option>
            <el-option label="旗舰" value="旗舰"></el-option>
        </el-select>

        <el-button type="primary" @click="">查询</el-button>

    </div>
    <div class="main-board">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="level" label="科技等级">
                <template #default="scope">
                    <span style="margin-left:20px">{{ 'T'+scope.row.level }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="舰船类型"/>
            <el-table-column prop="name" label="舰船名"/>
            <el-table-column label="操作" width="300">
                <template #default="scope">
                    <!-- <span style="margin-left: 10px">{{ scope.row.date }}</span> -->
                    <el-button type="primary" size="small">修改</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="bottom-board">
          <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000"></el-pagination>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            filter:{
                level:"0",
                type:'全部'
            },
            tableData:[
                {
                    id:1,
                    level:9,
                    type:'战列巡洋舰',
                    name:'幼龙级'
                }
            ]
        }
    }
}
</script>
<style lang="less">
.ship{
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
</style>