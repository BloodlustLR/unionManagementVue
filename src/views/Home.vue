<template>
<div class="home">
    <div :class="{'left':true,'left-collapse':isCollapse,'left-expend':!isCollapse}">
        <div class="logo">
            <img :src="logoSrc"/>
            <span v-show="showMenuText" style="width:65px">东部联邦</span>
        </div>
        <div class="menu">
            <div  v-for="(item ,index) in menuList" :key="index">
                <router-link :to="item.path">
                    <div class="menu-item">
                        <img :src="item.icon"/>
                        <span v-show="showMenuText" style="width:65px">{{item.title}}</span>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
    <div :class="{'right':true,'right-collapse':isCollapse,'right-expend':!isCollapse}">
        <div class="header">
            <div class="header-left header-item-click" style="width:60px;" @click="collapseOrExpendMenu">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-152cbb9b="" height="40" width="40" style="margin-top:10px"><path fill="currentColor" d="M640 384v256H384V384h256zm64 0h192v256H704V384zm-64 512H384V704h256v192zm64 0V704h192v192H704zm-64-768v192H384V128h256zm64 0h192v192H704V128zM320 384v256H128V384h192zm0 512H128V704h192v192zm0-768v192H128V128h192z"></path></svg>
            </div>
            <div class="header-right header-item-click" style="width:60px;">
                <el-dropdown>
                    <img class="el-dropdown-link" :src="headImg" style="height:60px;width:60px;"/>
                    <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人信息</el-dropdown-item>
                        <el-dropdown-item @click="logout">登出</el-dropdown-item>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="header-right header-item" style="margin-right:20px">{{"["+$store.state.loginInfo.shortArmy+"]"+$store.state.loginInfo.username}}</div>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
    <div class="clear"></div>
</div>
</template>
<script>
export default {
    name:'Home',
    components: {
        
    },
    data(){
        return{
            logoSrc:require("@/assets/logo.jpg"),
            isCollapse:false,
            showMenuText:true,

            headImg:require("@/assets/myHead.jpg"),
            menuList:[
                {
                    icon:require("@/assets/ship.png"),
                    title:"补损办公室",
                    path:"fillloss"
                },
                {
                    icon:require("@/assets/km.png"),
                    title:"KM统计",
                    path:"/"
                }
            ]
        }
    },
    created(){
        let loginInfo = {
            username:this.$cookies.get('username'),
            shortArmy:this.$cookies.get('shortArmy'),
            army:this.$cookies.get('army'),
            union:this.$cookies.get('union'),
            role:this.$cookies.get('role')
        }

        if(isEmpty(loginInfo.username)||isEmpty(loginInfo.role)){
            alert("请先登录");
            this.$router.push("/");
        }

        console.log(loginInfo);

        this.$store.commit("handleLogin",loginInfo);
    },
    methods:{
        /**
         * 收起或展开菜单
         */
        collapseOrExpendMenu(){
            this.isCollapse = !this.isCollapse;
            if(this.isCollapse){
                this.showMenuText = false;
            }else{
                setTimeout(()=>{
                    this.showMenuText = true;
                },300)
            }
        },

        /**
         * 登出
         */
        logout(){

            this.$cookies.remove('username');
            this.$cookies.remove('shortArmy');
            this.$cookies.remove('army');
            this.$cookies.remove('union');
            this.$cookies.remove('role');

            this.$store.commit("handleLogout");

            this.$router.push("/");
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
.home{
    height:100%;
    width:100%;

    .left{
        float:left;
        height:100%;
        background-color: rgb(34,45,50);
        transition: width .5s;
        -webkit-transition: width .5s; /* Safari */

        .logo{
            height:60px;
            background-color: rgb(64,141,187);

            img{
                height:60px;
                width:60px;
                vertical-align: middle;
            }

            span{
                color:white;
                vertical-align: middle;
                margin-left: 10px;
            }
        }

        .menu{
            height:calc(100% - 60px);

            .menu-item{
                height:60px;
                line-height: 60px;

                img{
                    height:30px;
                    width:30px;
                    vertical-align: middle;
                    margin-left:15px;
                }

                span{
                    color:white;
                    vertical-align: middle;
                    margin-left: 10px;
                }
            }

            .menu-item:hover{
                cursor: pointer;
                background-color: grey;
            }



        }
    }

    .left-collapse{
        width:60px;
    }

    .left-expend{
        width:200px;
    }

    .right{
        float:right;
        height:100%;
        transition: width .5s;
        -webkit-transition: width .5s; /* Safari */

        .header{
            height:60px;
            width: 100%;
            background-color: white;

            .header-left{
                float:left;
            }

            .header-right{
                float:right;
            }

            .header-item{
                height:60px;
                line-height:60px;
                display: inline-block;
                vertical-align: middle;
                text-align: center;
            }

            .header-item-click{
                height:60px;
                line-height:60px;
                display: inline-block;
                vertical-align: middle;
                text-align: center;
            }

            .header-item-click:hover{
                cursor: pointer;
                background-color: darkgray;
            }

        }

        .main{
            height:calc(100% - 60px);
            width: 100%;
            background-color: rgb(236,240,245);
        }


    }

    .right-collapse{
        width:calc(100% - 60px);
    }

    .right-expend{
        width:calc(100% - 200px);
    }


    .clear{
        clear:both;
    }
}
</style>