const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

const Order = seq.define('Orders', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户id'
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '地址id'
  },
  goods_info: {
    // STRING 不够用 用长文本TEXT
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '商品信息'
  },
  // 总金额
  total: {
    // 十进制 小数点后面保留两位
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '订单总金额'
  },
  order_number: {
    // 16位字符
    type: DataTypes.CHAR(16),
    allowNull: false,
    comment: '订单号'
  },
  // 订单状态
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '订单状态(0: 未支付, 1: 已支付, 2: 已发货, 3: 已签收, 4: 取消)'
  }
})

// Order.sync({ force: true })

module.exports = Order