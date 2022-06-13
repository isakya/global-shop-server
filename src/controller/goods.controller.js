const path = require('path')
const { fileUploadError, unSupportedFileType, publishGoodsError, updateGoodsError, invalidGoodsID } = require('../constant/err.type')
const { createGoods, updateGoods } = require('../service/goods.service')

class GoodsController {
  async upload(ctx, next) {
    // console.log(ctx.request.files.file)
    // file 是自定义名称，前端传过来的
    const { file } = ctx.request.files
    // 要求的文件类型
    const fileTypes = ['image/jpeg', 'image/png']
    if (file) {
      // 判断文件类型是否匹配
      if (!fileTypes.includes(file.mimetype)) {
        return ctx.app.emit('error', unSupportedFileType, ctx)
      }
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

  async create(ctx) {
    // 直接调用 service 的 createGoods 方法
    try {
      const { createdAt, updatedAt, ...res } = await createGoods(ctx.request.body)
      ctx.body = {
        code: 0,
        message: '发布商品成功',
        result: res
      }
    } catch (err) {
      console.error(err)
      return ctx.app.emit('error', publishGoodsError, ctx)
    }
  }

  async update(ctx) {
    try {
      // 在url里的id参数都会被ctx.params接收到
      const res = await updateGoods(ctx.params.id, ctx.request.body)
      if (res) {
        ctx.body = {
          code: 0,
          message: '修改商品成功',
          result: ''
        }
      } else {
        return ctx.app.emit('error', invalidGoodsID, ctx)
      }

    } catch (err) {
      console.error(err)
      updateGoodsError.result = err
      return ctx.app.emit('error', updateGoodsError, ctx)
    }
  }
}

module.exports = new GoodsController()