<template>
  <div class="shopcart">
    <!--购物车部分-->
    <div class="shopcart">
      <div class="content">
        <!--左侧内容-->
        <div class="content-left" @click="toggleList">
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
        <div class="content-right" @click="pay">
          <!--结算按钮-->
          <div class="pay" :class="{'enough':totalPrice>=minPrice}">{{payDesc}}</div>
        </div>
      </div>
      <!--小球动画-->
      <div class="ball-container">
        <div v-for="ball in balls">
          <!--给transition注册事件钩子-->
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping"
                      @after-enter="afterDrop">
            <!--外层元素实现y方向动画-->
            <div class="ball" v-show="ball.show">
              <!--内层元素实现x方向动画，类名inner-hook仅为了js选择dom-->
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <!--购物车详情列表,添加上拉动画-->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <span class="title">购物车</span>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li v-for="food in selectFoods" class="food">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--背景蒙层,添加浮现动画-->
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script>
  import cartcontrol from '../cartcontrol/cartcontrol'; //引入加减商品组件
  import BScroll from 'better-scroll'; //引入滚动插件

  export default {
    components: {
      cartcontrol
    },
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
    data() {
      return {
        //创建若干个可用于动画的小球
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],  //初始化已下降小球的数组
        fold: true  //定义购物车详情列表是否折叠
      };
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
          return `还差￥${this.minPrice - this.totalPrice}元起送`;  //差多少起送
        } else {
          return '去结算';   //够起送价，去结算
        }
      },
      //购物车详情列表是否显示的计算属性
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {  //没有再添加滚动，避免重复
              //给购物车详情列表初始化滚动条插件
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true,
              })
            } else {
              this.scroll.refresh();  //避免重新实例化滚动条
            }
          });
        }
        return show;
      }
    },
    methods: {
      //绑定增加食物事件时调用下降动画方法
      addFood(target) {
        this.drop(target);
      },
      //遍历用于动画的小球，使其显示，并绑定事件对象，加入已下降小球数组
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      //下降前所对应事件钩子的回调函数
      beforeDrop(el) {
        //遍历所有小球
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();  //获取相对于视口左上角的位置属性
            //计算需要移动的距离
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);  //窗口的高度-现在top-下降后bottom
            el.style.display = '';  //手动去除display:none，使小球显示出来
            //作y轴的偏移，使用translate3d可以开启GPU硬件加速，提升性能
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            //内层作x轴的偏移
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      //进入下落动画后，恢复小球的位置
      dropping(el) {
        let rf = el.offsetHeight;   //主动触发浏览器的重绘
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      //下落动画结束后，将小球移除并隐藏
      afterDrop(el) {
        let ball = this.dropBalls.shift();  //移除并返回数组中的第一个项
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      //点击购物车，折叠购物车详情列表
      toggleList() {
        if (!this.totalCount) {
          return;   //购物车为空，点击没有效果
        }
        this.fold = !this.fold;  //取反折叠状态
      },
      //清空购物车
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;   //设置每个被选择的食物的数量为0
        })
      },
      //点击去结算支付
      pay() {
        if (this.totalPrice >= this.minPrice) {
          alert(`支付￥${this.totalPrice}元`);  //弹框提示
        }
      },
      //购车车详情点击蒙层关闭
      hideList() {
        this.fold = true;
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../common/scss/mixin";

  .shopcart {
    position: fixed;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    .content {
      display: flex;
      background-color: #141d27;
      color: rgba(255, 255, 255, .4);
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
          &.enough {
            background-color: #00b43c; //够起送价，去结算样式
            color: #fff;
          }
        }
      }
    }
    .ball-container {
      .ball {
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        transition: all 0.4s cubic-bezier(.45, -0.55, 1, 0.62); //贝塞尔函数，调节过渡曲线
        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: rgb(0, 160, 220);
          transition: all 0.4s linear;
        }
      }
    }
    .shopcart-list {
      position: absolute;
      top: 0;
      width: 100%;
      z-index: -1;
      transform: translate3d(0, -100%, 0); //y轴：-100%相对于自身高度作偏移
      &.fold-enter-active, &.fold-leave-active {
        transition: all 0.4s; //开始和回来的过渡时间
      }
      &.fold-enter, &.fold-leave-to {
        transform: translate3d(0, 0, 0); //开始和回来的状态
      }
      .list-header {
        height: 39px;
        padding: 0 18px;
        background-color: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, .1);
        .title {
          float: left;
          font-size: 14px;
          font-weight: 200;
          line-height: 40px;
          color: rgb(7, 17, 27);
        }
        .empty {
          float: right;
          font-size: 12px;
          line-height: 40px;
          color: rgb(0, 160, 220);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        background-color: #fff;
        .food {
          position: relative;
          padding: 12px 0;
          @include border-1px(rgba(7, 17, 27, .1));
          .name {
            font-size: 14px;
            color: rgb(7, 17, 27);
            line-height: 24px;
          }
          .price {
            position: absolute;
            right: 90px;
            bottom: 12px;
            font-size: 14px;
            font-weight: 700;
            line-height: 24px;
            color: rgb(240, 20, 20);
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 6px;
          }
        }
      }
    }
  }

  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    background-color: rgba(7, 17, 27, .6);
    -webkit-backdrop-filter: blur(10px); //背景玻璃模糊
    opacity: 1;
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.5s;
    }
    &.fade-enter, &.fade-leave-to {
      opacity: 0;
      background-color: rgba(7, 17, 27, 0);
    }
  }
</style>
