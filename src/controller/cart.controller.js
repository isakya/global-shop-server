const { createOrUpdate, findCarts, updateCarts } = require('../service/cart.service')
const { cartFormatError } = require('../constant/err.type')

class CartController {
  async add(ctx) {
    // 将商品添加到购物车
    // 1. 解析 user_id, goods_id
    const user_id = ctx.state.user.id
    const goods_id = ctx.request.body.goods_id
    // 2. 操作数据库
    const res = await createOrUpdate(user_id, goods_id)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '添加到购物车成功',
      result: res
    }
  }

  async findAll(ctx) {
    // 1. 解析请求参数
    const { pageNum = 1, pageSize = 10 } = ctx.request.query
    // 2. 操作数据库
    const res = await findCarts(pageNum, pageSize)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '获取购物车列表成功',
      result: res
    }
  }

  async update(ctx) {
    // 1. 解析参数
    const id = ctx.request.params.id
    const { number, selected } = ctx.request.body
    // 判断两个参数是否都为空
    if (number === undefined && selected === undefined) {
      cartFormatError.message = 'number和selected不能同时为空'
      return ctx.app.emit('error', cartFormatError, ctx)
    }
    // 2. 操作数据库
    const res = await updateCarts({ id, number, selected })

    // 3. 返回数据
    ctx.body = {
      code: 0,
      message: '更新购物车成功',
      result: res
    }
  }
}

module.exports = new CartController()