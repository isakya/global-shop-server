// 抽离 koa 相关的代码
const Koa = require('koa')
const koaBody = require('koa-body')

const KoaBody = require('koa-body')

const userRouter = require('../router/user.route')

const app = new Koa()


app.use(KoaBody())
app.use(userRouter.routes())

module.exports = app