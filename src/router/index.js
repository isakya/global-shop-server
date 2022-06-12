// 统一导出所有路由模块
const fs = require('fs')

const Router = require('koa-router')
const router = new Router()

// 拿到当前文件夹下的所有文件名
fs.readdirSync(__dirname).forEach(file => {
  // console.log(file)
  if (file !== 'index.js') {
    let r = require('./' + file)
    // 路由也可以注册中间件
    router.use(r.routes())
  }
})

module.exports = router