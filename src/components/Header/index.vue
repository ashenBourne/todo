<template>
  <div class="header">

    <div class="title">
      四象限分析法（重要不紧急 > 重要且紧急 > 紧急不重要 > 不重要不紧急）
      <!-- <el-button type="primary" class="no-drag" @click="reload">刷新-测试</el-button> -->
    </div>
    <div class="utils">
      <el-button class="no-drag" size="mini" type="text" @click="minimize">
        <i class="btn el-icon-minus"></i>
      </el-button>

      <el-button
        class="no-drag hover-color"
        size="mini"
        type="text"
        @click="maximize"
      >
        <i class="btn el-icon-full-screen"></i>
      </el-button>
      <el-button
        class="no-drag hover-color"
        size="mini"
        type="text"
        @click="close"
      >
        <i class="btn el-icon-close"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
const win = remote.getCurrentWindow()
export default {
  methods: {
    reload() {
      this.$router.go(0)
    },
    // 最小化
    minimize() {
      win.minimize()
    },
    // 最大化
    maximize() {
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    },
    // 关闭
    close() {
      this.$confirm('此操作将退出此程序, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // win.destroy(); //这里之前用的是close，发现并不管用，用destroy就好使
          win.hide()
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  -webkit-app-region: drag;
  height:60px;
  // background-color: #EC4141;
  text-align: center;
  color: #333;
  line-height: 60px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px ;
  .utils{
    width:20%;
    text-align: right;
  }
  /deep/ {
    .el-button--text{
      color: #000;
    }
  }
}
</style>
