<template>
  <div id="app">
    <!--给header组件传递seller数据-->
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!--路由视图,需要传递seller数据，方便内部组件使用-->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  import header from '@/components/header/header'

  //定义数据获取成功状态码，方便更改
  const ERR_OK = 0;

  export default {
    name: 'App',
    data() {
      return {
        seller: {}
      }
    },
    //生命周期钩子
    created() {
      this.$http.get('/api/seller').then((response) => {
        response = response.data;   //获取data内的数据
        if (response.errno === ERR_OK) {   //判断错误码
          this.seller = response.data;
        }
      })
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "./common/scss/mixin"; //引入mixin.scss

  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    @include border-1px(rgba(7, 17, 27, 0.1)); //引入混合样式
    .tab-item {
      flex: 1;
      text-align: center;
      a {
        display: block;
        font-size: 14px;
        &.active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
</style>
