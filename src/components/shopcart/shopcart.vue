<template>
  <div class="shopcart">
    <!--左侧内容-->
    <div class="content-left">
      <!--购物车图标-->
      <div class="logo">
        <!--商品数量大于0时，添加高亮样式类名-->
        <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
        <!--购物车商品数量-->
        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
      </div>
      <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
      <!--配送费-->
      <div class="send-fee">另需配送费￥{{sendFee}}元</div>
    </div>
    <!--右侧内容-->
    <div class="content-right">
      <!--结算按钮-->
      <div class="pay" :class="{'enough':totalPrice>=minPrice}">{{payDesc}}</div>
    </div>
    <!--小球动画-->
    <div class="ball-container">
      <div v-for="ball in balls">
        <transition name="drop">
          <div class="ball">
            <div class="inner"></div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    //接收goods组件传进来的配送费和起送价数据
    props: {
      //接收加入购物车的食物数组，可用于计算
      selectFoods: {
        type: Array,
        default() {
          return [];   //type为对象或数组时，default为函数
        }
      },
      sendFee: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data(){
      return {
        balls:[
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
        ]
      }
    },
    computed: {
      //计算总价
      totalPrice() {
        let tatal = 0;
        this.selectFoods.forEach((food) => {
          tatal += food.price * food.count;
        });
        return tatal;
      },
      //计算选择商品总数
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      //右侧结算描述：起送价、差多少起送、去结算
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;   //ES6反引号写法，可以不用拼接字符串
        } else if (this.totalPrice < this.minPrice) {
          return `还差￥${this.minPrice-this.totalPrice}元起送`;  //差多少起送
        }else{
          return '去结算';   //够起送价，去结算
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .shopcart {
    position: fixed;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    display: flex;
    color: rgba(255, 255, 255, .4);
    background-color: #141d27;
    font-size: 0;
    .content-left {
      flex: 1; //自适应
      font-size: 0;
      .logo {
        display: inline-block;
        position: relative;
        width: 56px;
        height: 56px;
        margin: 0 12px;
        padding: 6px;
        box-sizing: border-box; //设置盒子模型，方便计算
        border-radius: 50%;
        top: -10px; //显示突出部分的圆
        background-color: #141d27;
        text-align: center;
        .icon-shopping_cart {
          display: inline-block;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #2b343c;
          font-size: 24px;
          line-height: 44px;
          &.highlight {
            background-color: rgb(0, 160, 220); //购物车高亮
            color: #fff;
          }
        }
        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 16px;
          padding: 0 6px;
          border-radius: 16px;
          background-color: rgb(240, 20, 20);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .4); //水平，垂直，模糊，尺寸，颜色
          font-size: 9px;
          line-height: 16px;
          color: #fff;
        }
      }
      .price {
        display: inline-block;
        margin: 12px 0;
        padding-right: 12px;
        border-right: 1px solid rgba(255, 255, 255, .1);
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
        vertical-align: top;
        &.highlight {
          color: #fff;
        }
      }
      .send-fee {
        display: inline-block;
        vertical-align: top;
        margin-left: 12px;
        font-size: 12px;
        line-height: 48px;
        font-weight: 200;
      }
    }
    .content-right {
      flex: 0 0 105px;
      width: 105px;
      .pay {
        font-size: 12px;
        font-weight: 700;
        line-height: 48px;
        text-align: center;
        background-color: #2b343c;
        &.enough{
          background-color: #00b43c;  //够起送价，去结算样式
          color: #fff;
        }
      }
    }
    .ball-container{
    }
  }
</style>
