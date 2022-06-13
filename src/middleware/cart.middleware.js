const { invalidGoodsID, cartFormatError } = require('../constant/err.type')
// const validator = async (ctx, next) => {
//   try {
//     ctx.verifyParams({
//       goods_id: { type: 'number', required: true }
//     })
//   } catch (err) {
//     console.error(err)
//     invalidGoodsID.result = err
//     return ctx.app.emit('error', invalidGoodsID, ctx)
//   }
//   await next()
// }

// 优化校验函数
const validator = (rules) => {
  // 利用了闭包，因为函数内部rules 引用了 参数的rules
  return async (ctx, next) => {
    try {
      ctx.verifyParams(rules)
    } catch (err) {
      console.error(err)
      cartFormatError.result = err
      return ctx.app.emit('error', cartFormatError, ctx)
    }
    await next()
  }
}

module.exports = {
  validator
}