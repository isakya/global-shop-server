const { invalidGoodsID } = require('../constant/err.type')
const validator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      goods_id: { type: 'number', required: true }
    })
  } catch (err) {
    console.error(err)
    invalidGoodsID.result = err
    return ctx.app.emit('error', invalidGoodsID, ctx)
  }
  await next()
}

// const validator = (rules) => {
//   return async (ctx, next) => {
//     try {
//       ctx.verifyParams(rules)
//     } catch (err) {
//       console.error(err)
//       invalidGoodsID.result = err
//       return ctx.app.emit('error', invalidGoodsID, ctx)
//     }
//     await next()
//   }
// }

module.exports = {
  validator
}