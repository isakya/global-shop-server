const { goodsFormatError } = require('../constant/err.type')
const validator = async (ctx, next) => {
  try {
    // 制定参数规则
    ctx.verifyParams({
      goods_name: { type: 'string', required: true },
      goods_price: { type: 'number', required: true },
      goods_num: { type: 'number', required: true },
      goods_img: { type: 'string', required: true }
    })
  } catch (err) {
    console.error(err)
    // 将错误信息写入到错误对象中，这样返回的错误信息会更加详细友好
    goodsFormatError.result = err
    return ctx.app.emit('error', goodsFormatError, ctx)
  }
  await next()
}

module.exports = {
  validator
}