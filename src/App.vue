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
    <!--<keep-alive> 包裹动态组件时，会缓存不活动的组件实例，避免切换路由导致数据变动。-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from '@/components/header/header'; //引入头部组件
  import {urlParse} from "./common/js/util";  //引入获取url查询字符串对象的方法

  //定义数据获取成功状态码，方便更改
  const ERR_OK = 0;

  export default {
    name: 'App',
    data() {
      return {
        seller: {
          //id 立即执行函数
          id: (() => {
            let queryParam = urlParse();  //调用获取url查询字符串对象的方法
            return queryParam.id;  //返回对象里的id属性值
          })()
        }
      }
    },
    //生命周期钩子
    created() {
      this.$http.get('/api/seller' + '?id=' + this.seller.id).then((response) => {
        response = response.data;   //获取data内的数据
        if (response.errno === ERR_OK) {   //判断错误码
          //将所有可枚举属性的值从一个或多个源对象复制到目标对象，避免seller.id属性被覆盖
          this.seller = Object.assign({}, this.seller, response.data);
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
