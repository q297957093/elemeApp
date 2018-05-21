<template>
  <div class="cartcontrol">
    <!--添加过渡动画，向左滚动-->
    <transition name="move">
      <!--减少按钮-->
      <div v-show="food.count>0" class="decrease" @click.stop.prevent="deFood">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <!--商品数量-->
    <div v-show="food.count>0" class="count">{{food.count}}</div>
    <!--增加按钮,点击事件后跟.stop.prevent防止事件冒泡，避免触发食物详情的点击事件-->
    <div class="add icon-add_circle" @click.stop.prevent="addFood"></div>
  </div>
</template>

<script>
  import Vue from 'vue';  //引入vue

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addFood() {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);  //通过Vue.set方法设置一个新属性，值为1
        } else {
          this.food.count++;   //增加数量
        }
        this.$emit('add', event.target);  //给当前实例派发事件，附加dom事件对象传给监听器回调
      },
      deFood() {
        this.food.count--;
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .cartcontrol {
    font-size: 0;
    .decrease {
      display: inline-block;
      padding: 6px; //增加用户点击按钮的区域,注意其他元素要减去此距离
      opacity: 1;
      transform: translate3d(0, 0, 0);
      .inner {
        display: inline-block;
        font-size: 24px;
        line-height: 24px;
        color: rgb(0, 160, 220);
        transition: all 0.3s linear;
        transform: rotate(0);
      }
      &.move-enter-active, &.move-leave-active {
        transition: all 0.3s linear; //定义过渡过程的时间
      }
      &.move-enter, &.move-leave-to {
        opacity: 0;
        transform: translate3d(24px, 0, 0); //平移到add按钮的位置
        .inner {
          transform: rotate(180deg); //旋转180度
        }
      }
    }
    .count {
      display: inline-block;
      width: 12px;
      padding-top: 6px; //与按钮6px相等，保持居中
      font-size: 10px;
      line-height: 24px;
      color: rgb(147, 153, 159);
      vertical-align: top;
      text-align: center;
    }
    .add {
      display: inline-block;
      padding: 6px; //增加用户点击按钮的区域,注意其他元素要减去此距离
      font-size: 24px;
      line-height: 24px;
      color: rgb(0, 160, 220);
    }
  }
</style>
