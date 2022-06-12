// 抽离 koa 相关的代码
const Koa = require('koa')

const KoaBody = require('koa-body')

const errHandler = require('./errHandler')

const router = require('../router')

const app = new Koa()


app.use(KoaBody())
app.use(router.routes())
// http请求方式不支持时 跑下面的中间件，给客户端报501 错误
app.use(router.allowedMethods())

// 统一错误处理
app.on('error', errHandler)

module.exports = app