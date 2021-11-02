<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import CRSQ3Base from '@/SQLite/base'
export default {
  created() {
    // 初始化数据库
    CRSQ3Base.dbInit()
  }
}
</script>
<style>
@import url("./assets/style/public.css");
@import url("./assets/style/reset.css");
#app{
  height:100%;
  width: 100%;
}
</style>
