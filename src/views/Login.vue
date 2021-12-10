<template>
<div class="login">
    <!-- 背景图片 -->
    <div id="bg" class="bg"></div>

    <!-- 登录面板 -->
    <div v-show="mode=='login'" class="logo-box animate__animated animate__fadeInUp">
        <img :src="logoSrc" style="vertical-align:middle;margin-right:20px;">
        <span>东部联邦</span>
    </div>
    <div v-show="mode=='login'" class="login-box animate__animated animate__fadeIn animate__delay-1s">
        <div class="input-box">
            <div class="input-item">
                <div class="title">账号</div>
                <div class="content"><el-input v-model="loginInfo.username" size="medium" placeholder="请输入账号" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">密码</div>
                <div class="content"><el-input v-model="loginInfo.password" size="medium" placeholder="请输入密码" /></div>
                <div class="clear"></div>
            </div>
        </div>
        <div class="button-box">
            <div class="button" @click="login">登录</div>
            <div class="button" @click="toRegister">注册</div>
        </div>
    </div>


    <!-- 注册面板 -->
    <div v-show="mode=='register'" class="register-box animate__animated animate__backInUp">
        <div class="logo-box animate__animated animate__fadeIn animate__delay-1s" style="margin-top:50px;">
            <img :src="logoSrc" style="vertical-align:middle;margin-right:20px;">
            <span>欢迎加入东部联邦</span>
        </div>
        <div class="input-box animate__animated animate__fadeIn animate__delay-1s" style="margin-top:60px">
            <div class="input-item">
                <div class="title">账号</div>
                <div class="content"><el-input v-model="registerInfo.username" size="medium" placeholder="请输入账号" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">密码</div>
                <div class="content"><el-input v-model="registerInfo.password" size="medium" placeholder="请输入密码" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">游戏名</div>
                <div class="content"><el-input v-model="registerInfo.gameId" size="medium" placeholder="请输入游戏名" /></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">所属军团</div>
                <div class="content">
                    <el-select v-model="registerInfo.armyId" size="medium" placeholder="选择你所在的军团" width="200" filterable>
                        <el-option v-for="(item,index) in armyList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="clear"></div>
            </div>
        </div>
        <div class="button-box animate__animated animate__fadeIn animate__delay-1s">
            <div class="button" @click="register">注册</div>
            <div class="button" @click="toLogin">返回登陆</div>
        </div>
    </div>


</div>
</template>

<script>
import CanvasNest from 'canvas-nest.js';
import { ElMessage } from 'element-plus'

export default {
  name: 'Login',
  components: {
    
  },
  data(){
      return{
        mode:'login',
        logoSrc:require("@/assets/logo.jpg"),

        loginInfo:{
            username:'',
            password:''
        },

        armyList:[],
        registerInfo:{
            username:'',
            password:'',
            gameId:'',
            armyId:null
        }
      }
  },
  created(){
    this.$request.get("/army/getAllArmy").then(res=>{
        this.armyList = res.obj;
    })
  },
  mounted(){
    let config = {
        color: '255,255,255',
        pointColor: '255,255,255',
        count: 150,
        opacity: 0.7
    };

    let ele = document.getElementById("bg");
    // Using config rendering effect at 'element'.
    new CanvasNest(ele, config);
  },
  methods:{
    toLogin(){
        this.mode="login";
    },

    login(){

        if(isEmpty(this.loginInfo.username)||isEmpty(this.loginInfo.password)){
            ElMessage({
                message: '请补全登录信息',
                type: 'warning',
            })
            return;
        }

        this.$request.post("/user/login",this.loginInfo).then(res=>{
            if(res.obj==null){
                ElMessage.error('请检查登录信息')
            }else{
                console.log(res.obj);
                ElMessage({
                    message: '登陆成功',
                    type: 'success',
                })

                this.$store.commit("handleLogin",res.obj);

                this.$cookies.set('username',res.obj.username);
                this.$cookies.set('shortArmy',res.obj.shortArmy);
                this.$cookies.set('army',res.obj.army);
                this.$cookies.set('union',res.obj.union);
                this.$cookies.set('role',res.obj.role);
                setTimeout(()=>{
                    this.$router.push("/home");
                },1000)
            }
        })
    },

    toRegister(){
        //   this.$request.get("/test/link").then(res=>{
        //       console.log(res);
        //   })
        this.mode="register";
    },

    register(){

        if(isEmpty(this.registerInfo.username)||isEmpty(this.registerInfo.password)||isEmpty(this.registerInfo.gameId)||isEmpty(this.registerInfo.armyId)){
            ElMessage({
                message: '请补全注册信息',
                type: 'warning',
            })
            return;
        }

        this.$request.post("/user/register",this.registerInfo).then(res=>{
            if(res.obj=="success"){
                ElMessage({
                    message: '注册成功',
                    type: 'success',
                })
                this.mode = "login";
            }else if(res.obj=="usernameExist"){
                ElMessage.error('账号已存在');
            }else if(res.obj=="gameIdExist"){
                ElMessage.error('游戏名已存在');
            }
        });
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
.login{
    height:100%;
    width:100%;
    color:white;
    

    .bg{
        position:absolute;
        top:0;
        left:0;
        z-index:-1;
        height:100%;
        width:100%;
        background: url("../assets/bg.jpeg") no-repeat;
        background-size: 100% 100%;
    }

    >.logo-box{
        position:absolute;
        top: 16%;
        left: 25%;
        height:18%;
        line-height: 200px;
        font-size: 100px;
        text-align: center;
        width: 50%;
        color:white;

        img{
            height:100%;
        }
    }

    .login-box{
        position:absolute;
        top: 44%;
        left: 38%;
        height:240px;
        width:24%;
        background-color: rgba(0,0,0,0.5);

        .input-box{
            width:100%;
            text-align: center;
            
            .input-item{
                height:40px;
                line-height: 40px;
                width: 300px;
                margin: 20px auto;

                .title{
                    float:left;
                    font-size:24px;
                    margin:0px 10px;
                }

                .content{
                    float:left;
                    input{
                        width:200px;
                    }
                }
            }
        }

        .button-box{
            text-align: center;
            height:60px;
            line-height:60px;

            .button{
                display: inline-block;
                vertical-align: middle;
                height:40px;
                width:100px;
                margin:0 20px;
                line-height: 40px;
                background-color: black;
                transition: background-color .5s;
            }

            .button:hover{
                cursor: pointer;
                background-color: white;
                color: black;
            }
        }
    }


    .register-box{
        position:absolute;
        top: 15%;
        left: 35%;
        height:600px;
        width:30%;
        background-color: rgba(0,0,0,0.5);


        .logo-box{
            height:120px;
            width:100%;
            line-height: 120px;
            font-size: 40px;
            text-align: center;
            color:white;

            img{
                height:100px;
                width:100px;
            }
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
                    font-size:24px;
                    margin:0px 10px;
                    width:100px;
                }

                .content{
                    float:left;
                    input{
                        width:300px;
                    }
                }
            }
        }

        .button-box{
            text-align: center;
            height:60px;
            line-height:60px;

            .button{
                display: inline-block;
                vertical-align: middle;
                height:40px;
                width:100px;
                margin:0 20px;
                line-height: 40px;
                background-color: black;
                transition: background-color .5s;
            }

            .button:hover{
                cursor: pointer;
                background-color: white;
                color: black;
            }
        }
    }
}
</style>
