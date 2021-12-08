<template>
<div class="login">
    <!-- 背景图片 -->
    <div id="bg" class="bg"></div>

    <!-- 登录面板 -->
    <div class="logo-box animate__animated animate__fadeInUp">
        <img :src="logoSrc" style="vertical-align:middle;margin-right:20px;">
        <span>东部联邦</span>
    </div>
    <div class="login-box animate__animated animate__fadeIn animate__delay-1s">
        <div class="input-box">
            <div class="input-item">
                <div class="title">账号</div>
                <div class="content"><input></div>
                <div class="clear"></div>
            </div>
            <div class="input-item">
                <div class="title">密码</div>
                <div class="content"><input></div>
                <div class="clear"></div>
            </div>
        </div>
        <div class="button-box">
            <div class="button" @click="login">登录</div>
            <div class="button">注册</div>
        </div>
    </div>
</div>
</template>

<script>
import CanvasNest from 'canvas-nest.js';
export default {
  name: 'Login',
  components: {
    
  },
  data(){
      return{
          logoSrc:require("@/assets/logo.jpg")
      }
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
      login(){
          this.$router.push("/home");
      }
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

    .logo-box{
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
                        height:20px;
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
}
</style>
