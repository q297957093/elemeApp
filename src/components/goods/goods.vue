<template>
  <div class="goods">
    <!--左侧菜单-->
    <div class="menu-wrapper border-1px" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" ref="menuList"
            :class="{'current':currentIndex===index}" @click="selectMenu(index)">
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
        <li v-for="item in goods" class="food-item" ref="foodList">
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
              <!--加减商品组件-->
              <div class="cartcontrol-wrapper">
                <!--手动$emit派发了add事件，在组件上绑定，就可以给父组件传递事件对象-->
                <cartcontrol :food="food" @add="addFood"></cartcontrol>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--购物车组件,需要传入seller配送费和起送价,传入被选择的食物-->
    <shopcart :sendFee="seller.deliveryPrice" :minPrice="seller.minPrice"
              :selectFoods="selectFoods" ref="shopcart"></shopcart>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';   //引入better-scroll滚动条插件
  import shopcart from '../shopcart/shopcart';  //引入购物车组件
  import cartcontrol from '../cartcontrol/cartcontrol';  //引入加减商品组件

  const ERR_OK = 0;  //初始化错误码常量
  export default {
    components: {
      shopcart,  //注册购物车组件
      cartcontrol  //注册加减商品组件
    },
    props: {
      seller: {
        type: Object  //接收App传进来的seller数据
      }
    },
    data() {
      return {
        goods: [],   //获取数据
        listHeight: [],  //右侧食物列表高度数组
        scrollY: 0  //右侧滚动条Y轴位置
      }
    },
    computed: {
      //计算左侧menu索引值对应的右侧食物列表高度
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          //获取高度区间范围
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          //判断在高度区间内
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            this._followScroll(i);   //调用滚动左侧menu
            return i;
          }
        }
        return 0;
      },
      //根据food的count属性，获取被选择的食物，并放入数组
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          })
        });
        return foods;
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
            this._calculateH();
          });
        }
      });
    },
    methods: {
      //初始化滚动方法
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true  //BScroll默认会阻止浏览器的原生click事件, 需设置为true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3  //有时候我们需要知道滚动的位置，需设置为3，实时派发 scroll 事件
        });
        //监听滚动事件，获取Y轴滚动值
        this.foodsScroll.on('scroll', (pos) => {
          // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
          if (pos.y <= 0) {
            this.scrollY = Math.abs(Math.round(pos.y));  //取整取绝对值
          }
        });
      },
      //计算食物列表高度，对应左侧menu
      _calculateH() {
        let foodList = this.$refs.foodList;  //获取dom元素
        let height = 0;  //初始化临时变量
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          height += foodList[i].clientHeight;   //递增每一个食物列表的高度
          this.listHeight.push(height);   //将高度push进数组
        }
      },
      //选择左侧menu，滚动到相对应的食物列表
      selectMenu(index) {
        let foodList = this.$refs.foodList;  //获取所有食物列表dom元素
        let el = foodList[index];   //获取选择索引对应的食物列表dom元素
        this.foodsScroll.scrollToElement(el, 300)  //滚动到指定的目标元素,滚动动画的时长
      },
      //滚动右侧食物列表，相对应的左侧menu跟随滚动，可避免左侧menu过长看不见的问题
      _followScroll(index) {
        let menuList = this.$refs.menuList;
        let el = menuList[index];
        this.menuScroll.scrollToElement(el, 300, 0, -100);  //相对于目标元素的纵轴偏移量
      },
      //加减购物车增加食物事件调用对应的小球动画方法
      addFood(target) {
        this._drop(target);
      },
      //由父组件goods，调用子组件的动画方法
      _drop(target) {
        //体验优化，异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
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
        &.current {
          /*对应右侧食物列表高亮menu*/
          position: relative;
          z-index: 10;
          background-color: #fff;
          margin-top: -1px; //遮盖上一元素的border
          @include border-none(); //取消该高亮元素的border
          .text {
            font-weight: 700;
          }
        }
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
          font-weight: 200;
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
          @include border-none(); //去除最后一个元素的边框
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
        .cartcontrol-wrapper {
          position: absolute;
          bottom: 12px;
          right: 0;
        }
      }
    }
  }
</style>
