<template>
  <div id="app">
    <v-header></v-header>
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
    <router-view/>
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
        response = response.body;  //获取数据对象
        if (response.errno === ERR_OK) {
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
  @import "./common/scss/mixins";
  //引入mixins.scss
  @import "./common/scss/base"; //引入base.scss

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
