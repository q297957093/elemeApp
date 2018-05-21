<template>
  <transition name="move">
    <!--添加从右侧滑入动画-->
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <!--头部大图-->
        <div class="img-header">
          <img :src="food.image">
          <!--后退按钮-->
          <i @click="back" class="icon-arrow_lift"></i>
        </div>
        <!--商品内容-->
        <div class="content">
          <h1 class="name">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol @add="addFood" :food="food"></cartcontrol>
          </div>
          <!--加入购物车按钮-->
          <transition name="fade">
            <!--被选择食物数量不存在或0才会显示-->
            <div @click.stop.prevent="addFirst($event)" v-show="!food.count|| food.count===0" class="buy">加入购物车</div>
          </transition>
        </div>
        <!--分割条组件,有商品介绍才需要显示-->
        <split v-show="food.info"></split>
        <!--商品介绍-->
        <div v-show="food.info" class="food-desc">
          <h2 class="title">商品介绍</h2>
          <p class="info">{{food.info}}</p>
        </div>
        <split></split>
        <!--商品评价-->
        <div class="ratings">
          <h2 class="title">商品评价</h2>
          <!--评价组件，传入所需参数-->
          <ratingselect @select="selectRating" @switchContent="switchContent" :selectType="selectType"
                        :onlyContent="onlyContent"
                        :ratingDesc="ratingDesc" :ratings="food.ratings"></ratingselect>
        </div>
        <!--评价列表-->
        <div class="rating-wrapper">
          <!--在评价有的时候显示列表-->
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
              <!--评价时间,应用filter过滤转化时间格式-->
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <div class="user">
                <!--用户名-->
                <span class="name">{{rating.username}}</span>
                <!--用户头像-->
                <img :src="rating.avatar" width="12" height="12" class="avatar">
              </div>
              <!--评价文本-->
              <p class="text">
                <!--根据评价类型设置不同的字体图标-->
                <span :class="{'icon-thumb_up':rating.rateType===0,
                'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <!--没评价则显示暂无评价文本-->
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
  import BScroll from 'better-scroll'; //引入滚动插件
  import cartcontrol from '../cartcontrol/cartcontrol'; //引入加减商品组件
  import Vue from 'vue';  //引入Vue
  import split from '../split/split';  //引入分割样式组件
  import ratingselect from '../ratingselect/ratingselect';  //引入商品评价组件

  const ALL = 2;
  export default {
    components: {
      cartcontrol,
      split,
      ratingselect
    },
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,  //food浮层显示标记
        //初始化该food组件下的评价组件ratingselect的所需参数
        selectType: ALL,  //评价类型
        onlyContent: true,  //只展示有内容的评价
        ratingDesc: {      //评价描述内容
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      //显示食物详情
      show() {
        this.showFlag = true;
        //每次打开商品评价，状态都被初始化，避免被前面的更改影响
        this.selectType = ALL;
        this.onlyContent = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      //返回按钮
      back() {
        this.showFlag = false;
      },
      //加入购物车按钮，添加第一个商品
      addFirst(event) {
        this.$emit('add', event.target);
        Vue.set(this.food, 'count', 1);  //手动设置count属性为1，以防不存在count属性
      },
      //派发增加商品事件
      addFood(target) {
        this.$emit('add', target);
      },
      //利用数据互通改变评价选择组件的评价类型
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();   //内容改变后高度变化，滚动重刷新
        });
      },
      //利用数据互通开关评价组件的是否只显示有内容的评价
      switchContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();  //内容改变后高度变化，滚动重刷新
        });
      },
      //根据评价的类型和是否有文本绑定v-show
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;   //若选择只显示有内容的评价，并且正好没有评价文本，则隐藏
        }
        if (this.selectType === ALL) {
          return true;  //若选择显示全部评价，则显示
        } else {
          return this.selectType === type;  //最后，只有选择类型和当前评价类型相等时才显示
        }
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../common/scss/mixin";

  .food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px; //留位给购物车
    z-index: 30; //小于购物车层
    width: 100%;
    background-color: #fff;
    transform: translate3d(0, 0, 0);
    &.move-enter-active, &.move-leave-active {
      transition: all 0.2s linear;
    }
    &.move-enter, &.move-leave-to {
      transform: translate3d(100%, 0, 0); //往右平移一个宽度的距离
    }
    .img-header {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%; //保持和宽度相等
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .icon-arrow_lift {
        position: absolute;
        left: 0;
        top: 10px;
        padding: 10px;
        font-size: 20px;
        color: #fff;
      }
    }
    .content {
      position: relative;
      padding: 18px;
      font-size: 0;
      .name {
        font-size: 14px;
        color: rgb(7, 17, 27);
        font-weight: 700;
        line-height: 14px;
      }
      .detail {
        margin-top: 8px;
        height: 10px;
        line-height: 10px;
        color: rgb(147, 153, 159);
        .sell-count {
          margin-right: 12px;
          font-size: 10px;
        }
        .rating {
          font-size: 10px;
        }
      }
      .price {
        margin-top: 18px;
        font-weight: 700;
        line-height: 24px;
        height: 24px;
        .now {
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240, 20, 20);
        }
        .old {
          font-size: 10px;
          color: rgb(147, 153, 159);
          text-decoration: line-through;
        }
      }
      .cartcontrol-wrapper {
        position: absolute;
        right: 12px;
        bottom: 12px;
      }
      .buy {
        position: absolute;
        right: 18px;
        bottom: 18px;
        padding: 0 12px;
        box-sizing: border-box;
        background-color: rgb(0, 160, 220);
        border-radius: 12px;
        font-size: 12px;
        line-height: 24px;
        color: #fff;
        opacity: 1;
        &.fade-enter-active, &.fade-leave-active {
          transition: all 0.2s;
        }
        &.fade-enter, &.fade-leave-to {
          opacity: 0;
        }
      }
    }
    .food-desc {
      padding: 18px;
      .title {
        margin-bottom: 6px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .info {
        padding: 0 8px;
        font-size: 12px;
        line-height: 24px;
        font-weight: 200;
        color: rgb(77, 85, 93);
        text-align: justify;
      }
    }
    .ratings {
      padding-top: 18px;
      .title {
        margin-left: 18px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
    }
    .rating-wrapper {
      padding: 0 18px;
      .rating-item {
        position: relative;
        padding: 16px 0;
        @include border-1px(rgba(7, 17, 27, .1));
        color: rgb(147, 153, 159);
        line-height: 12px;
        .time {
          margin-bottom: 6px;
          font-size: 10px;
        }
        .user {
          position: absolute;
          top: 16px;
          right: 0;
          font-size: 0;
          .name {
            margin-right: 6px;
            font-size: 10px;
          }
          .avatar {
            border-radius: 50%;
            vertical-align: top;
          }
        }
        .text {
          font-size: 12px;
          line-height: 16px;
          color: rgb(7, 17, 27);
          .icon-thumb_up, .icon-thumb_down {
            margin-right: 4px;
          }
          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }
          .icon-thumb_down {
            color: rgb(147, 153, 159);
          }
        }
      }
      .no-rating {
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147,153,159);
        text-align: center;
      }
    }
  }
</style>
