const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

// 创建模型
const User = seq.define('User', {
  user_name: {
    // 数据类型
    type: DataTypes.STRING,
    // 是否为空
    allowNull: false,
    // 值是否唯一
    unique: true,
    // 提示信息
    comment: '用户名,唯一'
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码'
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员, 0: 不是管理员(默认); 1: 是管理员'
  }
})

// 测试
// 1. force: true 如果存在这表，就强制删除再创建该表
// User.sync({ force: true })

// 2. node src/model/user.model.js 执行测试


module.exports = User