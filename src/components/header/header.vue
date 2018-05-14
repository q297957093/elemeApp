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
      <div class="support-count" v-if="seller.supports" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <!--图标字体 右箭头-->
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <!--公告部分-->
    <div class="bulletin" @click="showDetail">
      <!--为避免中间空隙，紧挨两个span，font-size:0会把省略号消除-->
      <span class="icon"></span><span class="text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <!--模糊背景图-->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!--详情浮层-->
    <div v-show="detailShow" class="detail-float">
      <!--使用sticky footer布局-->
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <!--h1标签更符合语义-->
          <h1 class="name">{{seller.name}}</h1>
          <!--给星星组件包起来写样式，避免影响组件复用-->
          <div class="star-wrapper">
            <!--星星评价组件，传入星星尺寸和评分-->
            <star :size="48" :score="seller.score"></star>
          </div>
        </div>
      </div>
      <div class="close" @click="closeDetail">
        <i class="icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import star from '../star/star';  //引入star组件

  export default {
    //注册star组件
    components: {
      star
    },
    //接收App传进来的参数
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false   //详情浮层显示标记
      };
    },
    methods: {
      showDetail() {
        this.detailShow = true;  //改变显示标记方法
      },
      closeDetail() {
        this.detailShow = false;  //关闭详情浮层
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
    position: relative;
    background-color: rgba(7, 17, 25, .5);
    color: #ffffff;
    overflow: hidden; //去除模糊背景多余
    /*头部内容*/
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
      .support-count {
        position: absolute;
        right: 12px;
        bottom: 14px;
        padding: 0 8px;
        height: 24px;
        background-color: rgba(0, 0, 0, .2);
        border-radius: 12px;
        text-align: center;
        .count {
          font-size: 10px;
        }
        .icon-keyboard_arrow_right {
          font-size: 10px;
          margin-left: 2px;
          line-height: 24px;
        }
      }
    }
    /*公告部分*/
    .bulletin {
      position: relative;
      height: 28px;
      padding: 0 22px 0 12px;
      background-color: rgba(7, 17, 27, .2);
      white-space: nowrap; //规定段落中的文字不进行换行
      overflow: hidden; //修剪超出文本
      text-overflow: ellipsis; //显示省略符号来代表被修剪的文本
      .icon {
        display: inline-block;
        width: 22px;
        height: 12px;
        @include bg-image('bulletin');
        background-size: 22px 12px;
        background-repeat: no-repeat;
        vertical-align: top;
        margin-top: 8px;
      }
      .text {
        margin: 0 4px;
        font-size: 10px;
        line-height: 30px;
      }
      i {
        position: absolute;
        right: 10px;
        bottom: 9px;
        font-size: 10px;
      }
    }
    /*模糊背景*/
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      filter: blur(10px); //滤镜毛玻璃效果
      z-index: -1; //降低层级
    }
    /*详情浮层*/
    .detail-float {
      position: fixed; //固定定位
      z-index: 100;
      width: 100%;
      height: 100%;
      top: 0;
      background-color: rgba(7, 17, 27, .8);
      overflow: auto;
      .detail-wrapper {
        min-height: 100%; //保证最小高度，使关闭按钮在底部
        .detail-main {
          margin-top: 64px;
          padding-bottom: 64px; //给底部关闭按钮空出位置
          .name {
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            line-height: 16px;
          }
          .star-wrapper {
            margin: 16px 0 28px 0;
            padding: 2px 0;
            text-align: center;
          }
        }
      }
      .close {
        width: 32px;
        height: 32px;
        margin: -64px auto 0 auto;
        font-size: 32px;
        color: rgba(255, 255, 255, .5);
      }
    }

  }
</style>
