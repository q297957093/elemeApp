<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <!--商家概观-->
      <div class="overview">
        <!--商家名-->
        <h1 class="title">{{seller.name}}</h1>
        <!--星级等描述-->
        <div class="desc border-1px">
          <!--星星组件-->
          <star :size="36" :score="seller.score"></star>
          <!--评价数和月售数-->
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <!--起送价等标记-->
        <ul class="remark">
          <!--起送价块区-->
          <li class="block">
            <h2>起送价</h2>
            <div class="value">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <!--商家配送费块区-->
          <li class="block">
            <h2>商家配送</h2>
            <div class="value">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <!--平均配送时间块区-->
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="value">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <!--收藏按钮-->
        <div class="favourite"></div>
      </div>
      <!--间隔条组件-->
      <split></split>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'; //引入滚动插件
  import star from '../star/star';  //引入星星组件
  import split from '../split/split';  //引入间隔条组件

  export default {
    components: {
      star,
      split
    },
    props: {
      seller: {
        type: Object
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../common/scss/mixin";

  .seller {
    position: absolute;
    top: 174px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      position: relative;
      padding: 18px;
      .title {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
      }
      .desc {
        padding-bottom: 18px;
        font-size: 0;
        @include border-1px(rgba(7, 17, 27, .1));
        .star {
          display: inline-block;
          margin-right: 8px;
          vertical-align: top;
        }
        .text {
          margin-right: 12px;
          font-size: 10px;
          line-height: 18px;
          color: rgb(77, 85, 93);
        }
      }
      .remark {
        display: flex;
        margin-top: 18px;
        .block {
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7, 17, 27, .1);
          &:last-child{
            border: none;
          }
          h2{
            margin-bottom: 4px;
            font-size: 10px;
            line-height: 10px;
            color: rgb(147,153,159);
          }
          .value{
            font-size: 10px;
            font-weight: 200;
            color: rgb(7,17,27);
            line-height: 24px;
            .stress{
              font-size: 24px;
              font-weight: 200;
            }
          }
        }
      }
    }
  }
</style>
