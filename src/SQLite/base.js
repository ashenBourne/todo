import { dirExists } from '../utils/index'

// 设置执行模式为输出调用堆栈。
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { app } = require('electron').remote

class CRSQ3BaseClass {
  constructor() {
    this.db = null
    // 数据库文件存放的绝对路径
    this._dbPath = path.join(app.getPath('userData'), 'db')
    // 当前登录人员的信息
    this._userInfo = { acct: '000000' }
  }

  async dbInit() {
    if (this.db) {
      return
    }
    // 得到路径并创建
    const mkdirStatus = await dirExists(this._dbPath)
    if (!mkdirStatus) {
      // eslint-disable-next-line no-throw-literal
      throw ('数据库路径创建失败')
    }
    this._dbPath = path.join(this._dbPath, 'db.db')

    // 实例化一个db连接
    console.log(this._dbPath, 'dbPath')
    this.db = new sqlite3.Database(this._dbPath, (err) => {
      if (err) {
        new Notification('无法加载数据库,请重启后重试', {
          body: `${err}`
        })
      }
    })
    console.log(this.db)
    console.log('实例化成功')
  }

  /**
    * 创建表
    * @param sentence    CREATE TABLE 语句
    * @used
    let sentence = `
    create table if not exists ${this.tableName}(
        begin_time varchar(255),
        create_time varchar(255),
        end_time varchar(255),
        play_id varchar(255),
        postion_id int(50),
        status int(50),
        task_id int(50)
    );`;
    this.createTable(sentence);
*/

  createTable(tablename, param) {
    const sqldata = param.join(',')
    const sentence = ` create table if not exists ${tablename} (${sqldata});`
    return new Promise((resolve, reject) => {
      this.db.exec(sentence, function(err) {
        if (err) {
          reject(new Error(err))
        } else {
          resolve({
            status: 0,
            msg: `表创建成功 || 已存在,不需要重新创建该表`
          })
        }
      })
    })
  }

  /**
     * 执行 增  删  改  查(单个数据查询或者多个数据查询)
     * @param sql    sql语句
     * @param param     参数(可以是数组或者数字或者字符串,根据sql语句来定)
     * @param mode    执行模式, 默认run,执行sql,如果查询的话,则使用get(单个)all(多个)
     * @returns {Promise}
    增 : this.sql(`insert into ${this.tableName} (begin_time, create_time, end_time, play_id, postion_id, status, task_id) values(?, ?, ?, ?, ?, ?, ?)`,
    [obj.begin_time, obj.create_time, obj.end_time, obj.play_id, obj.postion_id, obj.status, obj.task_id]);

    删 : this.sql(`delete from ${this.tableName} where id = ?`, id);

    改 : this.sql(`update ${this.tableName} set begin_time = ?, status = ? where postion_id = ?`, [begin_timeValue, statusValue, postion_idValue]);

    查 : this.sql(`select * from ${this.tableName} where id = ?`, id, 'get/all');
    */
  sql(sql, param, mode) {
    let m = 'all'
    // console.log(sql, param, 'sql')
    switch (mode) {
      case 'all':
        m = 'all'
        break
      case 'get':
        m = 'get'
        break
      case 'run':
        m = 'run'
        break
      case 'each':
        m = 'each'
        break
      default:
        m = 'all'
        break
    }
    return new Promise((resolve, reject) => {
      this.db[m](sql, param, function(err, data) {
        if (err) {
          reject(new Error(err))
        } else {
          if (data) {
            resolve(data) // 返回数据查询成功的结果
          } else {
            resolve('success')
          }
        }
      })
    })
  }

  /**
     * 获取当前数据库操作者信息
     *  @param {*}
  */
  get getUserInfo() {
    return this._userInfo
  }

  get dbPath() {
    return this._dbPath
  }
}

const CRSQ3Base = new CRSQ3BaseClass()

export default CRSQ3Base
