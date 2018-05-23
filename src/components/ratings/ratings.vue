<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <!--评价顶部概观-->
      <div class="overview">
        <!--左侧-->
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <!--右侧-->
        <div class="overview-right">
          <!--服务评分-->
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <!--商品评分-->
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore" class="star"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <!--送达时间-->
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <!--间隔条-->
      <split></split>
      <!--评价选择组件-->
      <ratingselect @select="selectRating" @switchContent="switchContent" :selectType="selectType"
                    :onlyContent="onlyContent" :ratings="ratings"></ratingselect>
      <!--评价列表-->
      <div class="ratings-wrapper">
        <ul>
          <li v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)"
              class="rating-item border-1px">
            <!--用户头像-->
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <!--用户名-->
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <!--星星组件-->
                <star :size="24" :score="rating.score"></star>
                <!--配送时间-->
                <span class="delivery-time" v-show="rating.deliveryTime">
                  {{rating.deliveryTime}}分钟
                </span>
              </div>
              <!--评价时间-->
              <div class="date">
                {{rating.rateTime | formatDate}}
              </div>
              <!--评价文本-->
              <p class="text">{{rating.text}}</p>
              <!--点赞，根据是否有推荐内容来显示-->
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import star from '../star/star';  //引入星星组件
  import ratingselect from '../ratingselect/ratingselect'; //引入评价选择组件
  import split from '../split/split';  //引入间隔条组件
  import BScroll from 'better-scroll'; //引入滚动插件
  import {formatDate} from "../../common/js/date";  //引入date.js内的方法

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    components: {
      star,
      ratingselect,
      split
    },
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        selectType: ALL,
        onlyContent: true,
        ratings: []  //ajax请求数据
      }
    },
    created() {
      //使用axios发ajax请求数据
      this.$http.get('/api/ratings').then((response) => {
        response = response.data;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          //修改数据后使用nextTick，dom更新循环后执行延迟回调，则可以在回调中获取更新后的DOM
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true     //初始化滚动插件
            });
          });
        }
      });
    },
    methods: {
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
    },
    filters: {
      formatDate(time) {
        let date = new Date(time); //将时间戳转化为时间对象
        return formatDate(date, 'yyyy-MM-dd hh:mm');  //调用formatDate方法，传入时间和格式字符串
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../common/scss/mixin";

  .ratings {
    position: absolute;
    top: 174px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      display: flex;
      padding: 18px 0;
      .overview-left {
        flex: 0 0 137px;
        width: 137px;
        padding: 6px 0;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
        @media only screen and (max-width: 320px) {
          flex: 0 0 120px; //为适应iphone5之类的小屏幕手机，避免样式错乱
          width: 120px;
        }
        .score {
          font-size: 24px;
          color: rgb(255, 153, 0);
          line-height: 28px;
          margin-bottom: 6px;
        }
        .title {
          font-size: 12px;
          color: rgb(7, 17, 27);
          line-height: 12px;
          margin-bottom: 8px;
        }
        .rank {
          font-size: 10px;
          color: rgb(147, 153, 159);
          line-height: 10px;
        }
      }
      .overview-right {
        flex: 1;
        padding: 6px 0 6px 24px;
        @media only screen and (max-width: 320px) {
          padding-left: 6px; //为适应iphone5之类的小屏幕手机，避免样式错乱
        }
        .score-wrapper {
          margin-bottom: 8px;
          font-size: 0;
          .title {
            margin-right: 12px;
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 18px;
          }
          .star {
            display: inline-block;
            margin-right: 12px;
            vertical-align: top;
          }
          .score {
            font-size: 12px;
            color: rgb(255, 153, 0);
            line-height: 18px;
          }
        }
        .delivery-wrapper {
          font-size: 0;
          .title {
            font-size: 12px;
            line-height: 18px;
            color: rgb(7, 17, 27);
          }
          .time {
            margin-left: 12px;
            font-size: 12px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
    .ratings-wrapper {
      padding: 0 18px;
      .rating-item {
        display: flex;
        padding: 18px 0;
        @include border-1px(rgba(7, 17, 27, .1));
        &:last-child {
          @include border-none();
        }
        .avatar {
          flex: 0 0 28px;
          width: 28px;
          margin-right: 12px;
          img {
            border-radius: 50%;
          }
        }
        .content {
          position: relative;
          flex: 1;
          .name {
            margin-bottom: 4px;
            font-size: 10px;
            color: rgb(7, 17, 27);
            line-height: 12px;
          }
          .star-wrapper {
            margin-bottom: 6px;
            font-size: 0;
            .star {
              display: inline-block;
              margin-right: 6px;
              vertical-align: top;
            }
            .delivery-time {
              font-size: 10px;
              font-weight: 200;
              color: rgb(147, 153, 159);
            }
          }
          .date {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 10px;
            font-weight: 200;
            color: rgb(147, 153, 159);
            line-height: 12px;
          }
          .text {
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 18px;
          }
          .recommend {
            margin-top: 8px;
            font-size: 0;
            line-height: 16px;
            .icon-thumb_up {
              margin-right: 8px;
              font-size: 12px;
              color: rgb(0, 160, 220);
            }
            .item {
              display: inline-block;
              margin-right: 8px;
              padding: 0 6px;
              border: 1px solid rgba(7, 17, 27, .1);
              border-radius: 1px;
              font-size: 9px;
              color: rgb(147, 153, 159);
            }
          }
        }

      }
    }
  }
</style>
