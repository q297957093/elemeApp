<template>
  <div class="header">
    <!--头部内容区-->
    <div class="header-content">
      <!--头像部分-->
      <div class="avatar">
        <!--头像图片，注意src要用v-bind-->
        <img width="64" height="64" :src="seller.avatar" alt="商家头像">
      </div>
      <!--商家信息-->
      <div class="seller-msg">
        <!--品牌店名-->
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/预计{{seller.deliveryTime}}分钟送达
        </div>
        <!--满减活动-->
        <div v-if="seller.supports" class="supports">
          <!--绑定data.json里type对应的图标类名，如：减、折、特-->
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <!--更多活动support-->
      <div class="support-count" v-if="seller.supports">
        <span class="count">{{seller.supports.length}}个</span>
        <!--图标字体 右箭头-->
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <!--公告部分-->
    <div class="bulletin">
      <span class="icon"></span>
      <span class="text">{{seller.bulletin}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    //接收App传进来的参数
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      //定义数组对应data.json中type的图标类名
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }
  };

  // console.log(seller);
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../common/scss/mixin"; //引入mixin.scss

  .header {
    background-color: rgba(7, 17, 25, .5);
    color: #ffffff;
    /*滤镜毛玻璃效果*/
    /*filter: blur(10px);*/
    .header-content {
      position: relative;
      padding: 24px 12px 18px 24px;
      font-size: 0; //为了消除头像和文字之间的空格
      .avatar {
        display: inline-block;
        vertical-align: top;
        img {
          border-radius: 2px;
        }
      }
      .seller-msg {
        display: inline-block;
        margin-left: 16px;
        .title {
          margin-top: 2px;
          margin-bottom: 8px;
          .brand {
            display: inline-block;
            margin-right: 6px;
            width: 30px;
            height: 18px;
            @include bg-image('brand'); //不同视网膜屏的背景图混合样式
            background-size: 30px 18px;
            background-repeat: no-repeat;
          }
          .name {
            font-size: 16px;
            font-weight: bold;
            line-height: 18px;
            vertical-align: top; //文字与头像对齐
          }
        }
        .description {
          font-size: 12px;
          line-height: 12px;
          margin-bottom: 10px;
        }
        .supports {
          margin-bottom: 2px;
          position: relative;
          .icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-right: 4px;
            vertical-align: middle;
            /*根据不同的类名，选择图标 如：减、折、特*/
            &.decrease {
              @include bg-image('decrease_1');
            }
            &.discount {
              @include bg-image('discount_1');
            }
            &.guarantee {
              @include bg-image('guarantee_1');
            }
            &.invoice {
              @include bg-image('invoice_1');
            }
            &.special {
              @include bg-image('special_1');
            }
            background-size: 12px 12px;
            background-repeat: no-repeat;
          }
          .text {
            /*因字体小于12px，为了手机端对齐*/
            position: absolute;
            top: 50%;
            margin-top: -5px;
            font-size: 10px;
            line-height: 12px;
          }
        }
      }
      .support-count{
        position: absolute;
        right: 12px;
        bottom: 14px;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        background-color: rgba(0,0,0,.2);
        border-radius: 12px;
        text-align: center;
        .count{
          font-size: 10px;
          vertical-align: top;
        }
        .icon-keyboard_arrow_right{
          font-size: 12px;
          margin-left: 2px;
          line-height: 24px;
        }
      }
    }

  }
</style>
