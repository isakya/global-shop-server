const path = require('path')

// 抽离 koa 相关的代码
const Koa = require('koa')

const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')
const parameter = require('koa-parameter')

const errHandler = require('./errHandler')
const router = require('../router')

const app = new Koa()


app.use(KoaBody({
  multipart: true,
  formidable: {
    // 不能在配置选项 用 ../ 相对路径
    // 在option里的相对路径，不是相对于当前文件，是相对于process.cwd()
    uploadDir: path.join(__dirname, '../upload'),
    keepExtensions: true
  }
}))
// 把某一路径作为静态资源的路径，当前端访问静态资源时自动跳到该路径
app.use(KoaStatic(path.join(__dirname, '../upload')))
// 注册参数校验包
app.use(parameter(app))
app.use(router.routes())
// http请求方式不支持时 跑下面的中间件，给客户端报501 错误
app.use(router.allowedMethods())

// 统一错误处理
app.on('error', errHandler)

module.exports = app