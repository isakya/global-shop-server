const path = require('path')
const { fileUploadError } = require('../constant/err.type')
class GoodsController {
  async upload(ctx, next) {
    // console.log(ctx.request.files.file)
    // file 是自定义名称，前端传过来的
    const { file } = ctx.request.files
    if (file) {
      ctx.body = {
        code: 0,
        message: '图片上传成功',
        result: {
          // 根据图片路径拿到图片名称
          goods_img: path.basename(file.filepath)
        }
      }
    } else {
      return ctx.app.emit('error', fileUploadError, ctx)
    }
  }
}

module.exports = new GoodsController()