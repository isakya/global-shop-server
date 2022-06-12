const Router = require('koa-router')
const { userValidator, verifyUser, cryptPassword, verifyLogin } = require('../middleware/user.middleware')


const { register, login, changePassword } = require('../controller/user.controller')
const { auth } = require('../middleware/auth.middleware')

const router = new Router({ prefix: '/users' })

// 注册接口
// 使用中间件
router.post('/register', userValidator, verifyUser, cryptPassword, register)

// 登陆接口
router.post('/login', userValidator, verifyLogin, login)

// 修改密码接口
// patch 是部分修改，put 是全部修改
router.patch('/', auth, cryptPassword, changePassword)

module.exports = router