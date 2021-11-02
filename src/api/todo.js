import CRSQ3Base from '../SQLite/base'

class TODOApi {
  constructor() {
    // 是否创建表
    this.initFlag = false
    // 表名
    this.tableName = 'todo'
    /**
     * 表结构
     * content：内容
     * rate：分数
     * create_time：创建时间
     * type：表类型
     * remark：备注
     *
     */
    this.tableData = ['id integer primary key autoincrement', 'content varchar(255)', 'process int(10)', 'rate int(5)', 'create_time varchar(30)', 'end_time varchar(30)', 'type varchar(10)', 'remark varchar']
    this.tableDataName = ['id', 'content', 'rate', 'process', 'create_time', 'type', 'remark', 'end_time']
    this.tableDataTitle = ['content', 'rate', 'process', 'create_time', 'type', 'remark', 'end_time']
  }
  /**
     * 创建消息表
     */
  async createTable() {
    // 1.创建表
    if (!this.initFlag) {
      try {
        await CRSQ3Base.createTable(this.tableName, this.tableData)
      } catch (e) {
        throw (new Error(e))
      }
    }
    this.initFlag = true
    return
  }
  // 根据表type获取每个类型表的内容
  async getListByType(type) {
    await this.createTable()
    let resultData
    try {
      resultData = await CRSQ3Base.sql(`SELECT * from ${this.tableName} where type = ?`, type, 'all')
    } catch (e) {
      throw new Error('查询失败')
    }
    return resultData
  }
  // 插入数据
  async insertData(data) {
    // create_time:截取当前时间戳
    const time = new Date().valueOf().toString()
    const {
      id,
      content = '',
      rate = 0,
      create_time = time,
      type,
      remark = '',
      end_time,
      process = 0
    } = data
    if (id) {
      throw new Error('不能插入id')
    }

    if (!content || !type || !create_time) {
      throw new Error('消息参数不完整')
    }
    await this.createTable()
    const sqlMsg = [
      content,
      rate,
      process,
      create_time,
      type,
      remark,
      end_time

    ]
    const value = this.tableDataTitle.map(() => '?')
    try {
      await CRSQ3Base.sql(`INSERT INTO ${this.tableName}(${this.tableDataTitle.join(',')}) VALUES(${value.join(',')})`, sqlMsg, 'run')
    } catch (error) {
      throw new Error(error)
    }
    return '数据插入成功'
  }
  // 更新数据
  async updatetData(data) {
    const {
      id,
      content,
      rate,
      type,
      remark,
      end_time,
      process = 0
    } = data

    if (!id || !content || !type) {
      throw new Error('消息参数不完整')
    }
    const sqlMsg = [
      content,
      rate,
      type,
      remark,
      end_time,
      process,
      id
    ]
    // 1.创建数据表
    await this.createTable()
    // 3.更新
    try {
      await CRSQ3Base.sql(`UPDATE ${this.tableName} SET content = ?,rate=?, type=?,remark=?,end_time=?,process=? where id = ?`, sqlMsg, 'run')
    } catch (e) {
      throw (new Error(e))
    }
    return '数据更新成功'
  }
  // 删:根据id删除
  async delete(id) {
    // 1.表没有创建
    await this.createTable()

    // 2.删除指定消息
    try {
      await CRSQ3Base.sql(`delete from ${this.tableName} where id = ?`, id)
    } catch (e) {
      throw (new Error(e))
    }

    return '数据删除成功'
  }
}
const api = new TODOApi()
export default api
