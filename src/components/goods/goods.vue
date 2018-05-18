<template>
  <div class="goods">
    <!--左侧菜单-->
    <div class="menu-wrapper border-1px" ref="menuWrapper">
      <ul>
        <li v-for="item in goods" class="menu-item">
          <span class="text">
            <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!--食物内容-->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!--菜品分类-->
        <li v-for="item in goods" class="food-item">
          <!--分类标题-->
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <!--分类内的食物列表-->
            <li v-for="food in item.foods" class="foods">
              <!--食物图片-->
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <!--食物详情-->
              <div class="content">
                <!--食物名称-->
                <h2 class="food-name">{{food.name}}</h2>
                <!--介绍-->
                <p class="description">{{food.description}}</p>
                <!--月售和好评-->
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <!--价格-->
                <div class="price">
                  <span class="now-price">￥{{food.price}}</span><span v-if="food.oldPrice" class="old-price">￥{{food.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';   //引入better-scroll滚动条插件

  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: []
      }
    },
    created() {
      //定义数组对应data.json中type的图标类名
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      //使用axios发ajax请求数据
      this.$http.get('/api/goods').then((response) => {
        response = response.data;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          //修改数据后使用nextTick，dom更新循环后执行延迟回调，则可以在回调中获取更新后的DOM
          this.$nextTick(() => {
            this._initScroll();
          });
        }
      });
    },
    methods: {
      //初始化滚动方法
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true
        });
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../common/scss/mixin";

  .goods {
    display: flex;
    position: absolute;
    width: 100%;
    top: 174px;
    bottom: 46px;
    overflow: hidden;
    .menu-wrapper {
      flex: 0 0 80px;
      width: 80px;
      background-color: #f3f5f7;
      .menu-item {
        display: table; //table布局，方便垂直居中
        width: 56px;
        height: 54px;
        padding: 0 12px;
        line-height: 14px;
        @include border-1px(rgba(7, 17, 27, .1));
        .icon {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          vertical-align: middle;
          /*根据不同的类名，选择图标 如：减、折、特*/
          &.decrease {
            @include bg-image('decrease_3');
          }
          &.discount {
            @include bg-image('discount_3');
          }
          &.guarantee {
            @include bg-image('guarantee_3');
          }
          &.invoice {
            @include bg-image('invoice_3');
          }
          &.special {
            @include bg-image('special_3');
          }
          background-size: 12px 12px;
          background-repeat: no-repeat;
        }
        .text {
          display: table-cell; //表格布局
          width: 56px;
          font-size: 12px;
          vertical-align: middle;
        }
      }
    }
    .foods-wrapper {
      flex: 1;
      .title {
        height: 26px;
        padding-left: 14px;
        background-color: #f3f5f7;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        line-height: 26px;
        color: rgb(147, 153, 159);
      }
      .foods {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7, 17, 27, .1));
        &:last-child {
          @include border-none();   //去除最后一个元素的边框
          margin-bottom: 0;
        }
        .icon {
          flex: 0 0 57px; //弹性布局，不变的57px图片
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .food-name {
            font-size: 14px;
            color: rgb(7, 17, 27);
            margin: 2px 0 8px 0;
          }
          .description, .extra {
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 12px;
          }
          .extra {
            margin-top: 8px;
            .count {
              margin-right: 12px;
            }
          }
          .price {
            line-height: 24px;
            color: rgb(147, 153, 159);
            .now-price {
              font-size: 14px;
              font-weight: 700;
              color: rgb(240, 20, 20);
              margin-right: 8px;
            }
            .old-price {
              font-size: 10px;
              font-weight: 700;
              text-decoration: line-through; //删除线
            }
          }
        }
      }
    }
  }
</style>
