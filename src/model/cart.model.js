// 1. 导入sequelize的链接
const { DataTypes } = require('sequelize')
const seq = require('../db/seq')
const Goods = require('./goods.model')

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

// 关联数据库
// 意思就是：Cart表中有 goods_id键 是属于Goods的
Cart.belongsTo(Goods, {
  // 外键
  foreignKey: 'goods_id',
  // 设置返回数据的别名, 不然会默认为 Good
  // 注意：查询的时候 includes 要定义为
  // includes: {
  //   model: Goods,
  //   as: 'goods_info'
  // }
  as: 'goods_info'
})

// 4. 导出Cart模型
module.exports = Cart