<template>
  <div class="ratingselect">
    <!--评价类型-->
    <div class="rating-type">
      <span @click="select(2)" class="block positive" :class="{'active':selectType===2}">
        {{ratingDesc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0)" class="block positive" :class="{'active':selectType===0}">
        {{ratingDesc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1)" class="block negative" :class="{'active':selectType===1}">
        {{ratingDesc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <!--只开有内容的评价开关-->
    <div @click="switchContent" class="switch" :class="{'on':onlyContent}">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  // 定义正面评价选择类型
  const POSITIVE = 0;  // 正面评价：0
  const NEGATIVE = 1; //负面评价：1
  const ALL = 2; //所有评价：2

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      //评价选择类型
      selectType: {
        type: Number,
        default: ALL  //默认为全部评价
      },
      //只查看有内容的评价
      onlyContent: {
        type: Boolean,
        default: false
      },
      //评价类型的描述
      ratingDesc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    methods: {
      //选择评价类型事件
      select(type) {
        this.$emit('select', type);  //派发事件给父组件去更改数据
      },
      //开关是否只看有内容的评价
      switchContent() {
        this.$emit('switchContent')  //派发事件给父组件去更改数据
      }
    },
    computed: {
      //正面评价数量的计算属性
      positives(){
        //filter--数组方法：返回给定函数的结果为true的项组成的数组
        return this.ratings.filter((rating)=>{
          return rating.rateType === POSITIVE;  //返回rateType为正面评价的数组
        });
      },
      //负面评价数量的计算属性
      negatives(){
        //filter--数组方法：返回给定函数的结果为true的项组成的数组
        return this.ratings.filter((rating)=>{
          return rating.rateType === NEGATIVE;  //返回rateType为负面评价的数组
        });
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../common/scss/mixin";

  .rating-type {
    padding: 18px 0;
    margin: 0 18px;
    @include border-1px(rgba(7, 17, 27, .1));
    font-size: 0;
    .block {
      display: inline-block;
      padding: 8px 12px;
      margin-right: 8px;
      border-radius: 2px;
      font-size: 12px;
      line-height: 16px;
      color: rgb(77, 85, 93);
      &.active {
        color: #fff;
      }
      &.positive {
        background-color: rgba(0, 160, 220, .2);
        &.active {
          background-color: rgb(0, 160, 220);
        }
      }
      &.negative {
        background-color: rgba(77, 85, 93, .2);
        &.active {
          background-color: rgb(77, 85, 93);
        }
      }
      .count {
        margin-left: 2px;
        font-size: 8px;
      }
    }
  }

  .switch {
    padding: 12px 18px;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
    color: rgb(147, 153, 159);
    font-size: 0;
    &.on {
      .icon-check_circle {
        color: #00c850; //开关勾选样式
      }
    }
    .icon-check_circle {
      margin-right: 4px;
      font-size: 24px;
    }
    .text {
      vertical-align: top;
      font-size: 12px;
      line-height: 24px;
    }
  }
</style>
