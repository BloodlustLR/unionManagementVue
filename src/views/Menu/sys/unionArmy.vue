<template>
<div class="unionArmy">

    <div class="action-board">
        <el-button type="primary" @click="openAddUnionModal">添加联盟</el-button>
    </div>
    <div class="tree-board">
        <el-input v-model="filterText" placeholder="请输入搜索关键词" />
        <el-tree ref="tree" :data="data" :props="defaultProps" :filter-node-method="filterNode" default-expand-all>
            <template #default="{ node, data}">
            <div v-if="node.level == 1" style="width:100%;">
                <div class="tree-title" style="font-size:14px;">{{ "["+data.shortName+"]"+data.name }}</div>
                <div class="tree-config" @click.stop="openConfigUnionModal(data)"><svg class="icon" width="10" height="10" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-365b8594=""><path fill="currentColor" d="M600.704 64a32 32 0 0130.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0134.432 15.36L944.32 364.8a32 32 0 01-4.032 37.504l-77.12 85.12a357.12 357.12 0 010 49.024l77.12 85.248a32 32 0 014.032 37.504l-88.704 153.6a32 32 0 01-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 01600.704 960H423.296a32 32 0 01-30.464-22.208L357.696 828.48a351.616 351.616 0 01-42.56-24.64l-112.32 24.256a32 32 0 01-34.432-15.36L79.68 659.2a32 32 0 014.032-37.504l77.12-85.248a357.12 357.12 0 010-48.896l-77.12-85.248A32 32 0 0179.68 364.8l88.704-153.6a32 32 0 0134.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 01423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 00-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 000 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0034.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0034.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 000-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 00-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 110 384 192 192 0 010-384zm0 64a128 128 0 100 256 128 128 0 000-256z"></path></svg></div>
                <div class="tree-add" @click.stop="openAddArmyModal(data)">+</div>
                <div class="tree-remove" @click.stop="removeUnion(data)">-</div>
            </div>
            <div v-if="node.level != 1" style="width:100%;">
                <div class="tree-title" style="font-size:12px;">{{ "["+data.shortName+"]"+data.name }}</div>
                <div class="tree-config" @click.stop="openConfigArmyModal(data)"><svg class="icon" width="10" height="10" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-365b8594=""><path fill="currentColor" d="M600.704 64a32 32 0 0130.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0134.432 15.36L944.32 364.8a32 32 0 01-4.032 37.504l-77.12 85.12a357.12 357.12 0 010 49.024l77.12 85.248a32 32 0 014.032 37.504l-88.704 153.6a32 32 0 01-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 01600.704 960H423.296a32 32 0 01-30.464-22.208L357.696 828.48a351.616 351.616 0 01-42.56-24.64l-112.32 24.256a32 32 0 01-34.432-15.36L79.68 659.2a32 32 0 014.032-37.504l77.12-85.248a357.12 357.12 0 010-48.896l-77.12-85.248A32 32 0 0179.68 364.8l88.704-153.6a32 32 0 0134.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 01423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 00-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 000 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0034.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0034.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 000-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 00-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 110 384 192 192 0 010-384zm0 64a128 128 0 100 256 128 128 0 000-256z"></path></svg></div>
                <div class="tree-remove" @click.stop="removeArmy(data)">-</div>
            </div>
            </template>
        </el-tree>
    </div>

    <el-dialog v-model="addUnionModal" title="新增联盟" width="500px" :close-on-click-modal="false">
        <div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                简称:<el-input v-model="unionInfo.shortName" placeholder="请输入联盟简称" style="width:200px;margin-left:10px;"/>
            </div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                全称:<el-input v-model="unionInfo.name" placeholder="请输入联盟名称" style="width:200px;margin-left:10px;"/>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addUnionModal = false">取消</el-button>
                <el-button type="primary" @click="addUnion">新增</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="configUnionModal" title="联盟配置" width="500px" :close-on-click-modal="false">
        <div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                简称:<el-input v-model="unionInfo.shortName" placeholder="请输入联盟简称" style="width:200px;margin-left:10px;"/>
            </div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                全称:<el-input v-model="unionInfo.name" placeholder="请输入联盟名称" style="width:200px;margin-left:10px;"/>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="configUnionModal = false">取消</el-button>
                <el-button type="primary" @click="configUnion">确认</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="addArmyModal" title="新增军团" width="500px" :close-on-click-modal="false">
        <div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                简称:<el-input v-model="armyInfo.shortName" placeholder="请输入军团简称" style="width:200px;margin-left:10px;"/>
            </div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                全称:<el-input v-model="armyInfo.name" placeholder="请输入军团全称" style="width:200px;margin-left:10px;"/>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addArmyModal = false">取消</el-button>
                <el-button type="primary" @click="addArmy">新增</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="configArmyModal" title="军团配置" width="500px" :close-on-click-modal="false">
        <div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                联盟:<el-select v-model="armyInfo.unionId" placeholder="选择军团所在的联盟" style="width:200px;margin-left:10px;" filterable>
                        <el-option v-for="(item,index) in unionList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
            </div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                简称:<el-input v-model="armyInfo.shortName" placeholder="请输入军团简称" style="width:200px;margin-left:10px;"/>
            </div>
            <div style="width:400px;margin:0 auto;text-align:center;height:60px;line-height:60px">
                全称:<el-input v-model="armyInfo.name" placeholder="请输入军团全称" style="width:200px;margin-left:10px;"/>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="configArmyModal = false">取消</el-button>
                <el-button type="primary" @click="configArmy">确认</el-button>
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
            filterText:'',
            unionList:[],
            data:[],
            defaultProps: {
                children: 'armyList',
                label: 'name',
            },


            addUnionModal:false,
            configUnionModal:false,
            unionInfo:{
                unionId:null,
                shortName:'',
                name:''
            },

            addArmyModal:false,
            configArmyModal:false,
            armyInfo:{
                armyId:null,
                unionId:null,
                shortName:'',
                name:''
            },

            
        }
    },
    watch: {
        filterText(val) {
        this.$refs.tree.filter(val)
        },
    },
    created(){
        this.$request.get("/union/getAllUnion").then(res => {
            this.unionList = res.obj;
        })
        this.filterAll();
    },
    mounted(){
        
    },
    methods:{

        filterAll(){
            this.$request.get("/union/getAllUnionArmy").then(res => {
                console.log(res);
                this.data = res.obj;
            })
        },

        filterNode(value, data) {
            if (!value) return true

            if(data.name.indexOf(value) !== -1) return true;

            if(data.shortName&&data.shortName.indexOf(value) !== -1) return true;

            return false;
        },

        openAddUnionModal(){
            this.addUnionModal = true;
            this.unionInfo.unionId = null;
            this.unionInfo.shortName = '';
            this.unionInfo.name = '';
        },

        addUnion(){
            if(isEmpty(this.unionInfo.shortName)||isEmpty(this.unionInfo.name)){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }

            this.$request.post("/union/addUnion",this.unionInfo).then(res => {
                if(res.obj=="success"){
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    })
                    this.addUnionModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('新增失败');
                }
            })

        },

        openConfigUnionModal(data){
            this.configUnionModal = true;
            this.unionInfo.unionId = data.id;
            this.unionInfo.shortName = data.shortName;
            this.unionInfo.name = data.name;
        },

        configUnion(){
            if(isEmpty(this.unionInfo.unionId)||isEmpty(this.unionInfo.name)||isEmpty(this.unionInfo.shortName)){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }
            this.$request.post("/union/configUnion",this.unionInfo).then(res => {
                if(res.obj=="success"){
                    ElMessage({
                        message: '配置成功',
                        type: 'success',
                    })
                    this.configUnionModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('配置失败');
                }
            })
        },

        removeUnion(data){
            console.log(data.id);
            ElMessageBox.confirm(
                '是否确认删除此联盟（会同时删除联盟下军团）?',
                '删除联盟',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.$request.post("/union/removeUnion",{
                    unionId:data.id
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

        openAddArmyModal(data){
            this.addArmyModal = true;
            this.armyInfo.armyId = null;
            this.armyInfo.unionId = data.id;
            this.armyInfo.shortName = '';
            this.armyInfo.name = '';
        },


        addArmy(){
            if(isEmpty(this.armyInfo.shortName)||isEmpty(this.armyInfo.name)){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }

            this.$request.post("/army/addArmy",this.armyInfo).then(res => {
                if(res.obj=="success"){
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    })
                    this.addArmyModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('新增失败');
                }
            })
        },

        openConfigArmyModal(data){
            this.configArmyModal = true;
            this.armyInfo.armyId = data.id;
            this.armyInfo.unionId = data.unionId;
            this.armyInfo.shortName = data.shortName;
            this.armyInfo.name = data.name;
        },

        configArmy(){
            if(isEmpty(this.armyInfo.unionId)||isEmpty(this.armyInfo.shortName)||isEmpty(this.armyInfo.name)){
                ElMessage({
                    message: '请先补全数据',
                    type: 'warning',
                })
                return;
            }
            this.$request.post("/army/configArmy",this.armyInfo).then(res => {
                if(res.obj=="success"){
                    ElMessage({
                        message: '配置成功',
                        type: 'success',
                    })
                    this.configArmyModal = false;
                    this.filterAll();
                }else{
                    ElMessage.error('配置失败');
                }
            })
        },

        removeArmy(data){
            console.log(data.id);
            ElMessageBox.confirm(
                '是否确认删除此军团?',
                '删除军团',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                this.$request.post("/army/removeArmy",{
                    armyId:data.id
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

        check(node,data){
            console.log(node,data);
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
.unionArmy{
    height:100%;
    width:100%;
    padding-top:20px;

    .action-board{
        height:60px;
        line-height: 60px;
        width:90%;
        margin:0 auto;
    }

    .tree-board{
        height:calc(90% - 60px);
        width:90%;
        margin:0 auto;
        background-color: white;
        overflow-y: auto;

        .tree-title{
            vertical-align:middle;
            display:inline-block;
        }

        .tree-add{
            font-size:14px;
            vertical-align:middle;
            display:inline-block;
            width:40px;
            height:16px;
            line-height:16px;
            background-color:rgb(131,205,94);
            color:white;
            text-align:center;
            margin-left:10px;
        }

        .tree-config{
            font-size:14px;
            vertical-align:middle;
            display:inline-block;
            width:40px;
            height:16px;
            line-height:16px;
            background-color:rgb(64,158,255);
            color:white;
            text-align:center;
            margin-left:10px;
        }

        .tree-remove{
            font-size:14px;
            float:right;
            width:40px;
            height:16px;
            line-height:16px;
            background-color:rgb(205, 94, 94);
            color:white;
            text-align:center;
            margin-right:20px;
        }
    }
}
</style>