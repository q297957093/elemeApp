<template>
  <div class="goods">
    <!--左侧菜单-->
    <div class="menu-wrapper border-1px">
      <ul>
        <li v-for="item in goods" class="menu-item">
          <span class="text">
            <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!--食物内容-->
    <div class="foods-wrapper"></div>
  </div>
</template>

<script>
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
        }
      })
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
        display: table;  //table布局，方便垂直居中
        width: 56px;
        height: 54px;
        padding: 0 12px;
        line-height: 14px ;
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
          display: table-cell;   //表格布局
          width: 56px;
          font-size: 12px;
          vertical-align: middle;
        }
      }
    }
    .foods-wrapper {
      flex: 1;
    }
  }
</style>
