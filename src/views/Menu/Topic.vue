<template>
<div class="topic">
    <div class="main-board">
        <div class="poster"><img :src="posterSrc"/></div>
        <div class="text">
            <div class="title">欢迎来到东部联邦</div>
            <div class="content">这里是你的家。</div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            posterSrc:require("@/assets/poster.jpeg")
        }
    }
}
</script>
<style lang="less">
.topic{
    height:100%;
    width:100%;
    padding-top:5%;

    .main-board{
        height:600px;
        width:1200px;
        margin:0 auto;
        background-color: white;

        .poster{
            float:left;
            height:600px;
            width:800px;

            img{
                height:600px;
                width:800px;
            }
        }

        .text{
            float:right;
            height:600px;
            width:400px;

            .title{
                padding-top:20px;
                font-size: 26px;
                font-weight: bolder;
                text-align: center;
            }

            .content{
                font-size: 16px;
                padding:20px;
            }

        }
    }
}
</style>
