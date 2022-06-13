const { Op } = require('sequelize')
const Cart = require('../model/cart.model')

class CartService {
  async createOrUpdate(user_id, goods_id) {
    // 根据 user_id && goods_id 一起查找，有没有记录
    let res = await Cart.findOne({
      where: {
        [Op.and]: {
          user_id,
          goods_id
        }
      }
    })
    if (res) {
      // 已经存在一条记录，将 number(商品数量) 增加 1 
      await res.increment('number')
      // 读取更新以后的结果再返回
      return await res.reload()
    } else {
      return await Cart.create({
        user_id,
        goods_id
      })
    }
  }
}

module.exports = new CartService()