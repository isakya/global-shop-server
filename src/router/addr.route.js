// 1. 导入koa-router包
const Router = require('koa-router')

// 2. 实例化对象
const router = new Router({ prefix: '/address' })

// 中间件/控制器
const { auth } = require('../middleware/auth.middleware')
const { validator } = require('../middleware/addr.middleware')
const { create, findAll, update } = require('../controller/addr.controller')

// 3. 编写路由规则

// 3.1 添加接口： 需登陆，格式等校验
router.post('/', auth, validator({
  consignee: 'string', phone: {
    type: 'string',
    format: /^1\d{10}$/
  }
}), create)

// 3.2 获取地址列表
router.get('/', auth, findAll)

// 3.3 更新地址
router.put('/:id', auth, validator({
  consignee: 'string', phone: {
    type: 'string',
    format: /^1\d{10}$/
  }
}), update)


// 4. 导出router对象
module.exports = router