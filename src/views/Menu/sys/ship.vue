<template>
<div class="ship">
    <div class="action-board">

        <el-button type="success" @click="openAddShipModal" style="margin-right:240px;">新增舰船</el-button>

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
            <el-option label="战列舰" value="战列舰"></el-option>
            <el-option label="旗舰" value="旗舰"></el-option>
            <el-option label="工业舰" value="工业舰"></el-option>
        </el-select>

        <el-button type="primary" @click="filterAll">查询</el-button>

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
                    <el-button type="primary" size="small" @click="openConfigShipModal(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="removeShip(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="bottom-board">
        <el-pagination :page-size="filter.pageSize" layout="prev, pager, next" :total="filter.pageTotal" @current-change="filterAll"></el-pagination>
    </div>

    <el-dialog v-model="addShipModal" title="新增舰船" width="500px" :close-on-click-modal="false">
        <div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                科技等级:<el-select v-model="shipInfo.level" placeholder="选择科技等级" style="width:200px;margin-left:10px;" filterable>
                            <el-option v-for="(item,index) in 10" :key="index" :label="'T'+item" :value="item"></el-option>
                        </el-select>
            </div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                舰船类型:<el-select v-model="shipInfo.type" placeholder="选择舰船类型" style="width:200px;margin-left:10px;" filterable>
                            <el-option label="护卫舰" value="护卫舰"></el-option>
                            <el-option label="驱逐舰" value="驱逐舰"></el-option>
                            <el-option label="巡洋舰" value="巡洋舰"></el-option>
                            <el-option label="战列巡洋舰" value="战列巡洋舰"></el-option>
                            <el-option label="战列舰" value="战列舰"></el-option>
                            <el-option label="旗舰" value="旗舰"></el-option>
                            <el-option label="工业舰" value="工业舰"></el-option>
                        </el-select>
            </div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                舰船名称:<el-input v-model="shipInfo.name" placeholder="请输入舰船名称" style="width:200px;margin-left:10px;"/>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addShipModal = false">取消</el-button>
                <el-button type="primary" @click="addShip">新增</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="configShipModal" title="配置舰船" width="500px" :close-on-click-modal="false">
        <div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                科技等级:<el-select v-model="shipInfo.level" placeholder="选择科技等级" style="width:200px;margin-left:10px;" filterable>
                            <el-option v-for="(item,index) in 10" :key="index" :label="'T'+item" :value="item"></el-option>
                        </el-select>
            </div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                舰船类型:<el-select v-model="shipInfo.type" placeholder="选择舰船类型" style="width:200px;margin-left:10px;" filterable>
                            <el-option label="护卫舰" value="护卫舰"></el-option>
                            <el-option label="驱逐舰" value="驱逐舰"></el-option>
                            <el-option label="巡洋舰" value="巡洋舰"></el-option>
                            <el-option label="战列巡洋舰" value="战列巡洋舰"></el-option>
                            <el-option label="旗舰" value="旗舰"></el-option>
                            <el-option label="工业舰" value="工业舰"></el-option>
                        </el-select>
            </div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                舰船名称:<el-input v-model="shipInfo.name" placeholder="请输入舰船名称" style="width:200px;margin-left:10px;"/>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="configShipModal = false">取消</el-button>
                <el-button type="primary" @click="configShip">确认</el-button>
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
                level:"0",
                type:'全部',
                pageNum:1,
                pageSize:10,
                pageTotal:0
            },
            tableData:[],

            addShipModal:false,
            configShipModal:false,
            shipInfo:{
                id:null,
                level:1,
                type:'护卫舰',
                name:''
            }
        }
    },
    created(){
        this.filterAll();
    },
    mounted(){
        
    },
    methods:{
        filterAll(pageNum){
            if(pageNum&&typeof pageNum === 'number'){
                this.filter.pageNum = pageNum;
            }
            console.log(this.filter.pageNum);
            this.$request.post("/ship/pageShip",this.filter).then(res =>{
                this.tableData = res.obj.records;
                this.filter.pageNum = res.obj.current;
                this.filter.pageSize = res.obj.size;
                this.filter.pageTotal = res.obj.total;
                console.log(res.obj);
                console.log(this.filter);
            })
        },

        openAddShipModal(){
            this.shipInfo={
                id:null,
                level:1,
                type:'护卫舰',
                name:''
            }
            this.addShipModal = true;
        },

        addShip(){
            if(isEmpty(this.shipInfo.name)){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }
            this.$request.post("/ship/addShip",this.shipInfo).then(res =>{
                if(res.obj=="success"){
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    })
                    this.addShipModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('新增失败');
                }
            })
        },

        openConfigShipModal(data){
            this.shipInfo={
                id:data.id,
                level:data.level,
                type:data.type,
                name:data.name
            }
            this.configShipModal = true;
        },

        configShip(){
            if(isEmpty(this.shipInfo.name)){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }
            this.$request.post("/ship/configShip",this.shipInfo).then(res => {
                if(res.obj=="success"){
                    ElMessage({
                        message: '配置成功',
                        type: 'success',
                    })
                    this.configShipModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('配置失败');
                }
            })
        },

        removeShip(id){
            ElMessageBox.confirm(
                '是否确认删除此舰船?',
                '删除舰船',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.$request.post("/ship/removeShip",{
                    shipId:id
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