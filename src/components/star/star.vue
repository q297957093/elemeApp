<template>
  <div class="star" :class="starType">
    <!--遍历生成评价星星-->
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
  const LENGTH = 5;  //定义星星个数常量
  //定义class常量，方便以后修改
  const CLS_ON = 'on';
  const CLS_OFF = 'off';
  const CLS_HALF = 'half';

  export default {
    //接收传入参数
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    //计算属性
    computed: {
      starType() {
        return 'star-' + this.size;
      },
      itemClasses() {
        let result = [];  //初始化结果数组
        let score = Math.floor(this.score * 2) / 2;   //算法：4.2取4，4.6取4.5，5取5
        let hasDecimal = score % 1 !== 0;   //设置是否有小数标记
        let integer = Math.floor(score);  //获取整数部分
        //循环整数，将整数个全星push进result数组
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);  //如果有小数，只需push一次半星
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);  //将剩余的空星push进去，补充数组长度
        }
        return result;  //返回类名数组
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../common/scss/mixin";

  .star {
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    /*给不一样size的星星设置样式*/
    &.star-48 {
      .star-item {
        width: 20px;
        height: 19px;
        margin-right: 22px; //每个星星之间的间隙
        background-size: 20px 19px;
        &:last-child {
          margin-right: 0;  //最后一颗星星没有右边距
        }
        /*给不一样得分的星星设置图片*/
        &.on {
          @include bg-image('star48_on')
        }
        &.off {
          @include bg-image('star48_off')
        }
        &.half {
          @include bg-image('star48_half')
        }
      }
    }
    &.star-36 {
      .star-item {
        width: 15px;
        height: 15px;
        margin-right: 6px;
        background-size: 15px 15px;
        &:last-child {
          margin-right: 0;  //最后一颗星星没有右边距
        }
        &.on {
          @include bg-image('star36_on')
        }
        &.off {
          @include bg-image('star36_off')
        }
        &.half {
          @include bg-image('star36_half')
        }
      }
    }
    &.star-24 {
      .star-item {
        width: 10px;
        height: 10px;
        margin-right: 3px;
        background-size: 10px 10px;
        &:last-child {
          margin-right: 0;  //最后一颗星星没有右边距
        }
        &.on {
          @include bg-image('star24_on')
        }
        &.off {
          @include bg-image('star24_off')
        }
        &.half {
          @include bg-image('star24_half')
        }
      }
    }
  }
</style>
