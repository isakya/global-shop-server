const { Op } = require('sequelize')
const Cart = require('../model/cart.model')
const Goods = require('../model/goods.model')

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

  async findCarts(pageNum, pageSize) {
    const offset = (pageNum - 1) * pageSize
    const { count, rows } = await Cart.findAndCountAll({
      // 需要的字段
      attributes: ['id', 'number', 'selected'],
      offset: offset,
      limit: pageSize * 1,
      // 查除了自己表内的数据外还要查 Goods 表里的数据
      include: {
        model: Goods,
        as: 'goods_info',
        // 需要的字段
        attributes: ['id', 'goods_name', 'goods_img']
      }
    })
    return {
      pageNum,
      pageSize,
      total: count,
      list: rows
    }
  }
}

module.exports = new CartService()