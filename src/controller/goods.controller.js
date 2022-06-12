class GoodsController {
  async upload(ctx, next) {
    ctx.body = 'tup'
  }
}

module.exports = new GoodsController()