const path = require('path')
const { fileUploadError, unSupportedFileType, publishGoodsError, updateGoodsError, invalidGoodsID, removeGoodsFailed } = require('../constant/err.type')
const { createGoods, updateGoods, removeGoods, restoreGoods, findGoods } = require('../service/goods.service')

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

  async remove(ctx) {
    try {
      const res = await removeGoods(ctx.params.id)
      if (res) {
        ctx.body = {
          code: 0,
          message: '下架商品成功',
          result: ''
        }
      } else {
        return ctx.app.emit('error', invalidGoodsID, ctx)
      }

    } catch (err) {
      console.error(err)
      removeGoodsFailed.result = err
      return ctx.app.emit('error', removeGoodsFailed, ctx)
    }
  }

  async restore(ctx) {
    try {
      const res = await restoreGoods(ctx.params.id)
      if (res) {
        ctx.body = {
          code: 0,
          message: '商品上架成功',
          result: ''
        }
      } else {
        return ctx.app.emit('error', invalidGoodsID, ctx)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async findAll(ctx) {
    // 1. 解析 pageNum 和 pageSize
    const { pageNum = 1, pageSize = 10 } = ctx.request.query
    // 2. 调用数据库处理的相关方法
    const res = await findGoods(pageNum, pageSize)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '获取商品列表成功',
      result: res
    }
  }
}

module.exports = new GoodsController()