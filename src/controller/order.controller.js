const { createOrder } = require('../service/order.service')

class OrderController {
  async create(ctx) {
    // 准备数据

    const user_id = ctx.state.user.id
    const { address_id, goods_info, total } = ctx.request.body

    // 订单编号 简单生成
    const order_number = 'DD' + Date.now()

    const res = await createOrder({ user_id, address_id, goods_info, total, order_number })

    ctx.body = {
      code: 0,
      message: '生成订单成功',
      result: res
    }
  }
}

module.exports = new OrderController()