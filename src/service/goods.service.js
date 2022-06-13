const Goods = require('../model/goods.model')
class GoodsService {
  async createGoods(goods) {
    const res = await Goods.create(goods)
    return res.dataValues
  }

  async updateGoods(id, goods) {
    const res = await Goods.update(goods, { where: { id } })
    console.log(res)
    return res[0] > 0 ? true : false
  }
  // 下架商品
  async removeGoods(id) {
    const res = await Goods.destroy({ where: { id } })
    return res > 0 ? true : false
  }
  // 上架商品
  async restoreGoods(id) {
    const res = await Goods.restore({
      where: { id }
    })
    return res > 0 ? true : false
  }

  // 查找所有商品
  async findGoods(pageNum, pageSize) {
    // // 1. 获取总数
    // const count = await Goods.count()
    // // 2. 获取分页的具体数据
    // const offset = (pageNum - 1) * pageSize
    // // offset 偏移量, limit 每页显示多少条
    // const rows = await Goods.findAll({ offset: offset, limit: pageSize * 1 })

    // 联合起来的api用法
    const offset = (pageNum - 1) * pageSize
    const { count, rows } = await Goods.findAndCountAll({ offset: offset, limit: pageSize * 1 })
    return {
      pageNum,
      pageSize,
      total: count,
      list: rows
    }
  }
}

module.exports = new GoodsService()