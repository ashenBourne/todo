<template>
  <div class="body-list">
    <div class="title">
      <span>{{ title }}</span>
      <i class="el-icon-circle-plus-outline add" @click="addNew"></i>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="list-table"
    >
      <el-table-column type="expand" width="40" align="center">
        <template slot-scope="{row}">
          <el-row style="padding:10px">
            <el-col span="4">
              创建时间：
            </el-col>
            <el-col span="8">
              {{ timeFilter(row.create_time) }}
            </el-col>
            <el-col span="4">
              投入时间：
            </el-col>
            <el-col span="8">
              {{ timeOperation(row.create_time,row.end_time) }}
            </el-col>
          </el-row>
          <el-row style="padding:10px">
            <el-col span="4">
              内容：
            </el-col>
            <el-col span="20">
              <el-input
                v-model="row.remark"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                @blur="saveData(row)"
              >
              </el-input>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="process"
        label="进度"
        align="center"
      >
        <template slot-scope="{row}">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
          >
            <div class="popover-content">
              <p class="popover-content-title">当前进度</p>
              <el-input-number v-model="row.process" :precision="2" :controls="false" :max="100" :min="0" @blur="saveData(row)"></el-input-number>
              %
            </div>
            <el-progress slot="reference" class="point" type="circle" :width="46" :percentage="row.process"></el-progress>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column
        prop="rate"
        label="分数"
        align="center"
      >
        <template slot-scope="{row}">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
          >
            <div class="popover-content">
              <p class="popover-content-title">分数</p>
              <el-input-number v-model="row.rate" :precision="2" :controls="false" :max="10" :min="0" @blur="saveData(row)"></el-input-number>
            </div>
            <span slot="reference" class="point">{{ row.rate }}</span>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="{row}">
          <el-button
            type="text"
            size="small"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
          <el-button
            v-if="!row.end_time"
            type="text"
            size="small"
            style="color:#409EFF"
            @click="handleFinish(row)"
          >
            完结
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="add-new" @click="addNew">
      +
    </div> -->
  </div>
</template>

<script>
import api from '@/api/todo'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    dataName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    setTimeout(() => {
      this.getTableData()
    }, 100)
  },
  methods: {
    handleFinish(data) {
      const now = new Date().valueOf().toString()
      data.end_time = now
      this.saveData(data)
    },
    async saveData(data) {
      data.create_time = data.create_time.toString()
      data.rate = Number(data.rate)
      data.process = Number(data.process)
      console.log(data)

      const res = await api.updatetData(data)

      if (res) {
        this.$message.success('更新成功')
        this.getTableData()
      }
    },
    timeFilter(time) {
      return this.dayjs(Number(time)).format('YYYY-MM-DD')
    },
    async deleteSure(id) {
      const res = await api.delete(id)
      if (res) {
        this.$message.success('删除成功')
        this.getTableData()
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSure(id)
        // this.tableData.splice(index, 1)
      }).catch(() => {
      })
    },
    /**
     * 计算该计划距今多久矣
     * @param {Data} time 创建时间
     */
    timeOperation(create_time, end_time) {
      let endTime = end_time
      if (!end_time) {
        endTime = new Date().valueOf()
      }
      const timeDuration = Number(endTime) - Number(create_time)
      return this.dayjs(timeDuration).format('D') + '天'
    },
    addNew() {
      this.$prompt('请输入标题', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.inserNewData(value)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    async inserNewData(content) {
      const res = await api.insertData({ content, rate: 0, type: this.dataName, remark: '' })
      if (res) {
        this.$message.success('新增成功')
        this.getTableData()
      }
    },
    // 获取本地存储数据
    async getTableData() {
      console.log('执行数据查询功能')
      console.log(this.dataName)
      if (!this.dataName) return
      console.log('查询参数' + this.dataName)
      const res = await api.getListByType(this.dataName)
      console.log('获取数据')
      console.log(res)
      this.tableData = res
    },
    updateTableData() {
      if (!this.dataName || !Array.isArray(this.tableData)) return
      localStorage.setItem(this.dataName, JSON.stringify(this.tableData))
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin tableTheme($color){
  th.is-leaf, td{
    border:none !important;
  }
  tr{
    background: $color !important;
  }
  td :hover,td :hover{
    background: $color !important;
  }
}
@mixin titleColor($color){
  color:$color;
}
.add{
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color:#fff;
}
.title{
  text-align: center;
  font-size: 20px;
  font-weight: 900;
  padding:10px 0;
  position: relative;
  border-radius: 8px 8px 0px 0px;
}
.body-list{
  height:100%;
  background: #fff;
  border-radius: 8px;
  /deep/ {
    .el-table--small th, .el-table--small td {
      padding: 2px 0;
    }
  }
}
.popover-content-title{
  margin: 0;
  padding:4px 0;
  font-size: 15px;
  font-weight: 900;
}
.point{
  cursor: pointer;
}
.list-table{
  height:70%;
  overflow-y: auto;
}
.urgencyUnimportance{
  /deep/ {
    // @include tableTheme(#EEBA4D);
  }
}

</style>
