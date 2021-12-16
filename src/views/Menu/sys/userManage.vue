<template>
<div class="userManage">
    <div class="action-board">
        <div style="text-align:center">
            联盟:
            <el-select v-model="filter.union" placeholder="选择联盟" style="width:200px;margin-right:20px;" filterable>
                <el-option label="全部" value="0"></el-option>
                <el-option v-for="(item,index) in unionList" :key="'union_'+index" :label="item.name" :value="item.id"></el-option>
            </el-select>

            军团:
            <el-select v-model="filter.army" placeholder="选择军团" style="width:200px;margin-right:20px;" filterable>
                <el-option label="全部" value="0"></el-option>
                <el-option v-for="(item,index) in armyList" :key="'army_'+index" :label="item.name" :value="item.id"></el-option>
            </el-select>

            游戏名:
            <el-input v-model="filter.gameId" style="width:200px;" placeholder="请输入游戏名" />

            账号:
            <el-input v-model="filter.username" style="width:200px;" placeholder="请输入账号" />

            角色:
            <el-select v-model="filter.role" placeholder="选择角色" style="width:200px;margin-right:20px;" filterable>
                <el-option label="全部" value="全部"></el-option>
                <el-option label="超级管理" value="超级管理"></el-option>
                <el-option label="联盟管理" value="联盟管理"></el-option>
                <el-option label="军团管理" value="军团管理"></el-option>
                <el-option label="普通会员" value="普通会员"></el-option>
            </el-select>

            <el-button type="primary" @click="filterAll">查询</el-button>
            <el-button type="success" @click="openAddUserModal">新增用户</el-button>
        </div>
    </div>

    <div class="main-board">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="union" label="联盟"/>
            <el-table-column prop="army" label="军团"/>
            <el-table-column prop="gameId" label="游戏名"/>
            <el-table-column prop="username" label="账号"/>
            <el-table-column prop="role" label="角色"/>
            <el-table-column label="操作" width="300">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="openConfigUserModal(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="removeUser(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="bottom-board">
        <el-pagination :page-size="filter.pageSize" layout="prev, pager, next" :total="filter.pageTotal" @current-change="filterAll"></el-pagination>
    </div>

    <el-dialog v-model="addUserModal" title="新增用户" width="500px" :close-on-click-modal="false">
        <div class="input-box">
            <div class="input-item">
                <div class="title">账号</div>
                <div class="content"><el-input v-model="addUserInfo.username" size="medium" placeholder="请输入账号" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">密码</div>
                <div class="content"><el-input v-model="addUserInfo.password" size="medium" placeholder="请输入密码" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">游戏名</div>
                <div class="content"><el-input v-model="addUserInfo.gameId" size="medium" placeholder="请输入游戏名" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">角色</div>
                <div class="content">
                    <el-select v-model="addUserInfo.roleId" size="medium" placeholder="选择你的角色" width="200" filterable>
                        <el-option label="超级管理" value="1"></el-option>
                        <el-option label="联盟管理" value="2"></el-option>
                        <el-option label="军团管理" value="3"></el-option>
                        <el-option label="普通会员" value="4"></el-option>
                    </el-select>
                </div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">所属军团</div>
                <div class="content">
                    <el-select v-model="addUserInfo.armyId" size="medium" placeholder="选择你所在的军团" width="200" filterable>
                        <el-option v-for="(item,index) in armyList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="clear"></div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addUserModal = false">取消</el-button>
                <el-button type="primary" @click="addUser">新增</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="configUserModal" title="配置用户" width="500px" :close-on-click-modal="false">
        <div class="input-box">
            <div class="input-item">
                <div class="title">账号</div>
                <div class="content"><el-input v-model="configUserInfo.username" size="medium" placeholder="请输入账号" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">密码</div>
                <div class="content"><el-input v-model="configUserInfo.password" size="medium" placeholder="请输入密码" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">游戏名</div>
                <div class="content"><el-input v-model="configUserInfo.gameId" size="medium" placeholder="请输入游戏名" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">角色</div>
                <div class="content">
                    <el-select v-model="configUserInfo.roleId" size="medium" placeholder="选择你的角色" width="200" filterable>
                        <el-option label="超级管理" value="1"></el-option>
                        <el-option label="联盟管理" value="2"></el-option>
                        <el-option label="军团管理" value="3"></el-option>
                        <el-option label="普通会员" value="4"></el-option>
                    </el-select>
                </div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">所属军团</div>
                <div class="content">
                    <el-select v-model="configUserInfo.armyId" size="medium" placeholder="选择你所在的军团" width="200" filterable>
                        <el-option v-for="(item,index) in armyList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="clear"></div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="configUserModal = false">取消</el-button>
                <el-button type="primary" @click="configUser">配置</el-button>
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
                union:"0",
                army:"0",
                role:'全部',
                gameId:'',
                username:'',
                pageNum:1,
                pageSize:10,
                pageTotal:0
            },
            unionList:[],
            armyList:[],
            tableData:[],

            addUserModal:false,
            addUserInfo:{
                username:'',
                password:'',
                roleId:'4',
                gameId:'',
                armyId:null
            },

            configUserModal:false,
            configUserInfo:{
                id:null,
                username:'',
                password:'',
                roleId:'4',
                gameId:'',
                armyId:null
            },

        }
    },
    created(){
        this.getAllUnion();
        this.getAllArmy();
        this.filterAll();
    },
    mounted(){
        
    },
    methods:{
        getAllUnion(){
            this.$request.get("/union/getAllUnion").then(res =>{
                this.unionList = res.obj;
            })
        },

        getAllArmy(){
            this.$request.get("/army/getAllArmy").then(res =>{
                this.armyList = res.obj;
            })
        },

        filterAll(pageNum){
            if(pageNum&&typeof pageNum === 'number'){
                this.filter.pageNum = pageNum;
            }
            this.$request.post("/user/pageUser",this.filter).then(res =>{
                this.tableData = res.obj.records;
                this.filter.pageNum = res.obj.current;
                this.filter.pageSize = res.obj.size;
                this.filter.pageTotal = res.obj.total;
                console.log(res.obj);
                console.log(this.filter);
            })
        },

        openAddUserModal(){
            this.addUserInfo={
                username:'',
                password:'',
                roleId:'4',
                gameId:'',
                armyId:null
            }
            this.addUserModal = true;
        },

        addUser(){
            if(isEmpty(this.addUserInfo.username)||isEmpty(this.addUserInfo.password)||isEmpty(this.addUserInfo.gameId)||isEmpty(this.addUserInfo.armyId)){
                ElMessage({
                    message: '请补全注册信息',
                    type: 'warning',
                })
                return;
            }

            this.$request.post("/user/register",this.addUserInfo).then(res=>{
                if(res.obj=="success"){
                    ElMessage({
                        message: '注册成功',
                        type: 'success',
                    })
                    this.addUserModal = false;
                    this.filterAll();
                }else if(res.obj=="usernameExist"){
                    ElMessage.error('账号已存在');
                }else if(res.obj=="gameIdExist"){
                    ElMessage.error('游戏名已存在');
                }
            });
        },

        openConfigUserModal(data){
            console.log(data.roleId.toString());
            this.configUserInfo={
                id:data.id,
                username:data.username,
                password:data.password,
                roleId:data.roleId.toString(),
                gameId:data.gameId,
                armyId:data.armyId
            }
            this.configUserModal = true;
        },

        configUser(){
            if(isEmpty(this.configUserInfo.username)||isEmpty(this.configUserInfo.password)||isEmpty(this.configUserInfo.gameId)){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }
            this.$request.post("/user/configUser",this.configUserInfo).then(res => {
                if(res.obj=="success"){
                    ElMessage({
                        message: '配置成功',
                        type: 'success',
                    })
                    this.configUserModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('配置失败');
                }
            })
        },

        removeUser(id){
            ElMessageBox.confirm(
                '是否确认删除此用户?',
                '删除用户',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.$request.post("/user/removeUser",{
                    userId:id
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
.userManage{
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

    .input-box{
        width:100%;
        text-align: center;
        
        .input-item{
            height:40px;
            line-height: 40px;
            width: 450px;
            margin: 20px auto;
            text-align: center;

            .title{
                float:left;
                margin:0px 10px;
                width:100px;
            }

            .content{
                float:left;
                input{
                    width:240px;
                }
            }
        }
    }
}
</style>