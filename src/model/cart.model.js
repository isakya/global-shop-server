// 1. 导入sequelize的链接
const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

// 2. 定义Cart模型
const Cart = seq.define('Carts', {
  goods_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品id'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户id'
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '商品数量'
  },
  selected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否选中'
  }
})

// 3. 同步数据（建表）
// node ./src/model/cart.model.js 执行创建表
// Cart.sync({ force: true })

// 4. 导出Cart模型
module.exports = Cart