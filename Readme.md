# 一、项目初始化

## 1 npm初始化

``` npm init -y
npm init -y
```

生成 package.json 文件：

- 记录项目的依赖

## 2 git初始化

```
git init
```

生成 .git 隐藏文件夹，该文件夹就是 git 的本地仓库

创建 .gitignore 文件：

- 用于忽略提交某文件

查看 git 提交记录：

![image-20220126001324221](https://gitee.com/dinosaur-egg/images_source/raw/master/image-20220126001324221.png)

## 3 创建 ReadMe 文件

## 4 把项目提交到本地仓库

```js
git add .
git commit -m '项目初始化'
```

# 二、搭建项目

## 1 安装 Koa 框架

```js
npm install koa
```

## 2 编写最基础的app

在根目录下创建 `src/main.js` 

```js
const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.log('server is running on http://localhost:3000')
})
```

## 3 测试

在终端执行 `node src/main.js`

# 三、项目的基本优化

## 1 自动重启服务

安装 nodemon 工具

```
npm i nodemon -D
```

编写脚本 package.json 脚本

```js
  "scripts": {
    "dev": "nodemon ./src/main.js", // 新增 dev 脚本命令
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

执行 `npm run dev` 启动服务

![image-20220123135808096](https://gitee.com/dinosaur-egg/images_source/raw/master/image-20220123135808096.png)

## 2 读取配置文件

安装 dotenv

- `dotenv`：读取根目录中的 `.env`文件，将配置写在 `process.env` 中

```
npm install dotenv
```

创建 `.env` 文件

```
APP_PORT=8000
```

创建 `src/config/config.default.js`

```js
const dotenv = require('dotenv')

dotenv.config()

// console.log(process.env.APP_PORT) // 测试用

module.exports = process.env
```

改写`main.js`

```js
const Koa = require('koa')

// 导入process.env
const { APP_PORT } = require('./config/config.default')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello world'
})

// 改写端口
app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

# 四、添加路由

路由：根据不同的URL，调用对应的处理函数

## 1 安装koa-router

```
npm install koa-router
```

步骤：

1. 导入包
2. 实例化对象
3. 编写路由
4. 注册中间件

## 2 编写路由

创建 `src/router` 目录，编写`user.router.js`

```js
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// GET /users/
router.get('/', (ctx, next) => {
  ctx.body = 'hello users'
})

module.exports = router
```

## 3 改写main.js

```js
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')
// 导入
const userRouter = require('./router/user.route')

const app = new Koa()
// 注册
app.use(userRouter.routes())

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

# 五、目录结构优化

## 1 将http服务和app业务拆分

`app文件夹：存储业务相关代码`

创建 `src/app/index.js` 

```js
// 抽离 koa 相关的代码
const Koa = require('koa')

const userRouter = require('../router/user.route')

const app = new Koa()

app.use(userRouter.routes())

module.exports = app
```

改写main.js

```js
const { APP_PORT } = require('./config/config.default')

const app = require('./app')

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

## 2 将路由和控制器拆分

路由：解析URL，分发给控制器对应的方法

控制器：处理不同的业务

改写 `user.router.js`

```js
const Router = require('koa-router')

const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' })

// 注册接口
router.post('/register', register)

// 登陆接口
router.post('/login', login)

module.exports = router
```

创建 `controller/user.controller.js`

```js
class UserController {
  async register(ctx, next) {
    ctx.body = '用户注册成功'
  }

  async login(ctx, next) {
    ctx.body = '登陆成功'
  }
}

module.exports = new UserController()

```

# 六、解析body

## 1 安装koa-body

```
npm i koa-body
```

## 2 注册中间件

改写 `app/index.js`

![image-20220126000602405](https://gitee.com/dinosaur-egg/images_source/raw/master/image-20220126000602405.png)

## 3 解析请求的数据

改写 `user.controller.js` 文件

```js
const { createUser } = require('../service/user.service')
class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    console.log(res)
    // 3.返回结果
    ctx.body = ctx.request.body
  }

  async login(ctx, next) {
    ctx.body = '登陆成功'
  }
}

module.exports = new UserController()
```

## 4 拆分 `service` 层

`service层` 主要是做数据库的处理

创建 `src/service/user.service.js`

```js
class UserService {
  async createUser(user_name, password) {
    // todo: 写入数据库
    return '写入数据库成功'
  }
}

module.exports = new UserService()
```

# 七、数据库操作

sequelize ORM 数据库工具

ORM：对象关系映射

- 数据表映射(对应)一个类
- 数据表中的数据行(记录)对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

## 1 安装对应插件

```
npm i mysql2 sequelize
```

`创建对应数据库`

![image-20220611163209184](https://gitee.com/dinosaur-egg/images_source/raw/master/image-20220611163209184.png)

## 2 连接数据库

创建 `src/db/seq.js`

```js
const { Sequelize } = require('sequelize')

// 导入env配置文件，让数据库的配置信息不必写死
const { MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB } = require('../config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql'
})

// 测试用 node src/db/seq.js 执行测试
// seq.authenticate().then(() => {
//   console.log('数据库连接成功')
// }).catch(err => {
//   console.log('数据库连接数百', err)
// })

module.exports = seq
```

## 3 编写`.env` 配置文件

![image-20220127015427405](https://gitee.com/dinosaur-egg/images_source/raw/master/image-20220127015427405.png)

# 八、创建User模型

## 1 拆分Model层

sequelize主要通过Model对应数据表

创建src/model/user.model.js

```js
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

// user 在表里会自动生成 users
const User = seq.define('user', {
  // id 会被sequelize自动创建和管理
  user_name: {
    // 数据类型
    type: DataTypes.STRING,
    // 是否为空
    allowNull: false,
    // 值是否唯一
    unique: true,
    // 提示信息
    comment: '用户名,唯一'
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull:false,
    comment: '密码'
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否为管理员，0：否(默认) 1：是'
  }
}, {
  // 让数据库不默认添加 创建时间 和 更新时间 的字段 (可选)
  timestamps: false
})

// 测试
// 1. force: true 如果存在这表，就强制删除再创建该表
// User.sync({ force: true })
// 2. node src/model/user.model.js 执行测试

module.exports = User
```

## 2 添加用户

编辑`src/service/user.service.js`

```js
// 1. 导入用户模型
const User = require('../model/user.model')
class UserService {
  async createUser(user_name, password) {
    // 2. 插入数据
    const res = await User.create({
      user_name,
      password
    })
    // 3. return 出去
    return res.dataValues
  }
}

module.exports = new UserService()
```

编辑 `src/controller/user.controller.js`

```js
const { createUser } = require('../service/user.service')
class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // 3. 将操作数据库的结果返回给客户端
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name
      }
    }
  }
}

module.exports = new UserController()
```

```json
客户端：创建成功结果
{
    "code": 0,
    "message": "用户注册成功",
    "result": {
        "id": 6,
        "user_name": "xiaoming4"
    }
}
```

## 3 用户注册错误处理

`判断注册的用户是否存在`

`src/service/user.service.js`

```js
// 1. 导入用户模型
const User = require('../model/user.model')
class UserService {
  async createUser(user_name, password) {
    // 2. 插入数据
    const res = await User.create({
      user_name,
      password
    })
    // 3. return 出去
    return res.dataValues
  }

   // 判断注册的用户是否存在，需要查询数据库中的数据
  async getUserInfo({ id, user_name, password, is_admin }) {
    const whereOpt = {}
    // 如果 id 存在 则 放到 whereOpt 对象里面
    id && Object.assign(whereOpt, { id })
    user_name && Object.assign(whereOpt, { user_name })
    password && Object.assign(whereOpt, { password })
    is_admin && Object.assign(whereOpt, { is_admin })
    const res = await User.findOne({
      attributes: ['id', 'user_name', 'password', 'is_admin'],
      where: whereOpt
    })
    return res ? res.dataValues : null
  }
}

module.exports = new UserService()
```

`src/controller/user.controller.js`

```js
const { createUser, getUserInfo } = require('../service/user.service')
class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    const { user_name, password } = ctx.request.body

    // 错误处理
    // 判断：合法性
    if (!user_name || !password) {
      console.error('用户名或密码为空', ctx.request.body)
      ctx.status = 400
      ctx.body = {
        code: '10001',
        message: '用户名或密码为空'
      }
      return // 不让下面代码执行
    }

    // 判断：合理性
    if (getUserInfo({ user_name })) {
      // 409 表示冲突
      ctx.status = 409
      ctx.body = {
        code: '10002',
        message: '用户已存在',
        result: ''
      }
      return
    }

    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name
      }
    }
  }

  async login(ctx, next) {
    ctx.body = '登陆成功'
  }
}

module.exports = new UserController()
```

## 4 抽离 错误处理代码  至 中间件

创建并编辑`src/middleware/user.middleware.js`

```js
const { getUserInfo } = require('../service/user.service')


const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 判断：合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    ctx.status = 400
    ctx.body = {
      code: '10001',
      message: '用户名或密码为空'
    }
    return // 不然下面代码执行
  }
  await next()
}


const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body
  // 判断：合理性
  if (getUserInfo({ user_name })) {
    // 409 表示冲突
    ctx.status = 409
    ctx.body = {
      code: '10002',
      message: '用户已存在',
      result: ''
    }
    return
  }
  await next()
}

module.exports = {
  userValidator,
  verifyUser
}
```

使用中间件 `src/router/user.route.js`

```js
const Router = require('koa-router')

// 导入中间件
const { userValidator, verifyUser } = require('../middleware/user.middleware')

const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' })

// 使用中间件
router.post('/register', userValidator, verifyUser, register)

router.post('/login', login)

module.exports = router
```

## 5 统一错误处理

创建并编辑 `src/constant/err.type.js`

```js
// 编写错误对象
module.exports = {
  userFormateError: {
    code: '10001',
    message: '用户名或密码为空',
    result: ''
  },
  userAlreadyExited: {
    code: '10002',
    message: '用户已存在',
    result: ''
  }
}
```

编辑  `src/middleware/user.middleware.js`

```js
const { getUserInfo } = require('../service/user.service')
// 导入错误对象
const { userFormateError, userAlreadyExited } = require('../consitant/err.type')

const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 判断：合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    // 提交错误到统一错误处理中间件
    // 参数 (error(自定义事件), 错误对象, 请求上下文)
    ctx.app.emit('error', userFormateError, ctx)
    return
  }
  await next()
}

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body
  // 判断：合理性
  if (getUserInfo({ user_name })) {
    // 提交错误到统一错误处理中间件
    ctx.app.emit('error', userAlreadyExited, ctx)

    return
  }
  await next()
}

module.exports = {
  userValidator,
  verifyUser
}
```



抽离统一错误处理的中间件函数

`src/app/errHandler.js`

```js
module.exports = (err, ctx) => {
  let status = 500
  // 根据 code 码判断是哪种类型的错误
  switch (err.code) {
    case '10001':
      status = 400
      break
    case '10002':
      status = 409
      break
    default:
      status = 500
  }
  ctx.status = status
  ctx.body = err
}
```

统一错误处理

`src/app/index.js`

```js
const Koa = require('koa')

const KoaBody = require('koa-body')

// 导入抽离的中间件函数
const errHandler = require('./errHandler')

const userRouter = require('../router/user.route')

const app = new Koa()


app.use(KoaBody())
app.use(userRouter.routes())

// 监听error事件，统一错误处理
app.on('error', errHandler)

module.exports = app
```

## 6 错误处理的补充与完善

原因：操作数据库时，可能会发生未知错误，所以需要进一步完善错误处理

即：所有数据库操作都需要进行该方面的错误处理

`src/controller/user.controller.js`

```js
const { createUser } = require('../service/user.service')
const { userRegisterError } = require('../constant/err.type')
class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    const { user_name, password } = ctx.request.body

    // try...catch 完善错误处理，因为操作数据库时可能会发生不明错误
    try {
      // 2. 操作数据库
      const res = await createUser(user_name, password)
      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: '用户注册成功',
        result: {
          id: res.id,
          user_name: res.user_name
        }
      }
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', userRegisterError, ctx)
    }
  }

  async login(ctx, next) {
    ctx.body = '登陆成功'
  }
}

module.exports = new UserController()
```

`src/middleware/user.middleware.js`

```js
const { getUserInfo } = require('../service/user.service')
const { userFormateError, userAlreadyExited, userRegisterError } = require('../constant/err.type')

const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    ctx.app.emit('error', userFormateError, ctx)
    return 
  }
  await next()
}

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body

  // 判断：合理性
  // 同样使用 try...catch 捕获错误
  try {
    const res = await getUserInfo({ user_name })
    if (!res) {
      console.error('用户名已经存在', { user_name })
      ctx.app.emit('error', userAlreadyExited, ctx)
      return
    }
  } catch (err) {
    console.error('获取用户信息错误', err)
    ctx.app.emit('error', userRegisterError, ctx)
    return
  }

  await next()
}

module.exports = {
  userValidator,
  verifyUser
}
```

# 九、加密

在将密码保存到数据库之前，要对密码进行加密处理

## 1 安装 bcryptjs

```
npm i bcryptjs
```

## 2 加密

在中间件文件下增加如下代码`src/middleware/user.middleware.js`

```js
// 导入密码加密包
const bcrypt = require('bcryptjs')

const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body
  const salt = bcrypt.genSaltSync(10)
  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt)
  ctx.request.body.password = hash
  await next()
}

module.exports = {
  cryptPassword
}
```

## 3 使用加密中间件

`src/router/user.route.js`

```js
const Router = require('koa-router')
// 导入加密中间件cryptPassword
const { userValidator, verifyUser, cryptPassword } = require('../middleware/user.middleware')

const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' })

// 使用加密中间件
router.post('/register', userValidator, verifyUser, cryptPassword, register)

router.post('/login', login)

module.exports = router
```

# 十、验证登陆

## 1 编写中间件函数 

验证 用户名 密码 是否存在或匹配

`src/middleware/user.middleware.js`

```js
const verifyLogin = async (ctx, next) => {
  // 1. 判断用户是否存在(不存在报错)
  const { user_name, password } = ctx.request.body

  // 注意：try..catch 有块级作用域
  try {
    const res = await getUserInfo({ user_name })
    if (!res) {
      console.error('用户不存在', { user_name })
      ctx.app.emit('error', userDoesNotExit, ctx)
      return
    }
    // 2. 密码是否匹配(不匹配: 报错)
    if (!bcrypt.compareSync(password, res.password)) {
      ctx.app.emit('error', invalidPassword, ctx)
      return
    }
  } catch (err) {
    console.error(err)
    return ctx.app.emit('error', userLoginError, ctx)
  }
    
    
```

## 2 使用中间件函数

`src/router/user.route.js`

```js
const Router = require('koa-router')
const { userValidator, verifyUser, cryptPassword, verifyLogin } = require('../middleware/user.middleware')

const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' })

router.post('/register', userValidator, verifyUser, cryptPassword, register)

// 登陆接口
// 使用中间件函数
// userValidator 判断用户是否存在
router.post('/login', userValidator, verifyLogin, login)

module.exports = router
```

# 十一、用户的认证

登陆成功后，给用户颁发一个令牌token，用户在以后的每一次请求中携带这个令牌。

jwt: jsonwebtoken

- header: 头部
- payload: 载荷 ---- 需要在令牌携带的信息
- sinature: 签名 ---- 保证令牌的安全性和有效性

## 1 安装 jsonwebtoken

```
npm i jsonwebtoken 
```

## 2 使用 jwt 生成 token

`src/controller/user.controller.js`

```js
// 导入 jwt 
const jwt = require('jsonwebtoken')

  async login(ctx, next) {
    const { user_name } = ctx.request.body

    // 1. 获取用户信息（在token的payload中，记录id，user_name, is_admin）
    try {
      // 解构剔除 password 属性，将剩下的属性放到res
      const { password, ...res } = await getUserInfo({ user_name })
      ctx.body = {
        code: 0,
        message: '用户登陆成功',
        result: {
          // 生成token，expiresIn 为过期时间
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
        }
      }

    } catch (err) {
      console.error('用户登陆失败', err)
    }
  }
```

# 十二、修改密码前的信息认证

## 1 增加修改密码路由

`src/router/user.route.js`

```js
// 修改密码接口
// patch 是部分修改，put 是全部修改
router.patch('/', auth, (ctx, next) => {
  ctx.body = '修改密码成功'
})
```

## 2 增加认证用户信息中间件 auth

`src/middleware/auth.middleware.js`

```js
const jwt = require('jsonwebtoken')
// 导入秘钥
const { JWT_SECRET } = require('../config/config.default')
// 导入错误处理对象
const { tokenExpiredError, invalidToken } = require('../constant/err.type')

const auth = async (ctx, next) => {
  // 拿到请求头的 token
  const { authorization } = ctx.request.header
  // 去掉 'Bearer '
  const token = authorization.replace('Bearer ', '')
  console.log(token)

  try {
    // user中包含了payload的信息(id, user_name, is_admin)
    const user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  } catch (err) {
     // 将 jwt 抛出的错误进行处理
    switch (err.name) {
      case 'TokenExpiredError':
        console.error('token已过期', err)
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        console.error('无效的token', err)
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }
  await next()
}
```

# 十三、修改密码

## 1 打通流程

`src/router/user.route.js`

```js
const Router = require('koa-router')
const { userValidator, verifyUser, cryptPassword, verifyLogin } = require('../middleware/user.middleware')

// 引入修改密码处理函数 changePassword
const { register, login, changePassword } = require('../controller/user.controller')
const { auth } = require('../middleware/auth.middleware')

const router = new Router({ prefix: '/users' })

router.post('/register', userValidator, verifyUser, cryptPassword, register)

router.post('/login', userValidator, verifyLogin, login)

// 修改密码接口
// patch 是部分修改，put 是全部修改
// 修改前先将密码加密 cryptPassword
router.patch('/', auth, cryptPassword, changePassword)

module.exports = router
```

## 2 操作数据库修改密码

`src/service/user.service.js`

```js
  // 参数传对象的原因是为了可以让参数和参数顺序不那么固定
  // 不仅可修改密码，还可以修改其他信息（都为可选修改）
  async updateById({ id, user_name, password, is_admin }) {
    const whereOpt = { id }
    const newUser = {}
    user_name && Object.assign(newUser, { user_name })
    password && Object.assign(newUser, { password })
    is_admin && Object.assign(newUser, { is_admin })

    const res = await User.update(newUser, { where: whereOpt })
    return res[0] > 0 ? true : new error()
  }
```



## 3 组织修改步骤

`src/controller/user.controller.js`

```js
// 引入 updateById 更新数据函数
const { createUser, getUserInfo, updateById } = require('../service/user.service')
// 引入 changePwdError 错误对象
const { userRegisterError, changePwdError } = require('../constant/err.type')

async changePassword(ctx, next) {
    // 1. 获取数据
    const id = ctx.state.user.id
    const password = ctx.request.body.password
    // 2. 操作数据库
    try {
      await updateById({ id, password })
      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: '修改密码成功',
        result: ''
      }
    } catch (err) {
      console.error(err)
      ctx.app.emit('error', changePwdError, ctx)
    }
  }
```

# 十四、实现路由文件自动加载

背景：当路由文件越来越多的时候，需要在 `src/app/index.js` 需要不断重复导入，这样显然过于麻烦，耦合性太强，也不利于后期维护，为解决这一问题，我们需要在 `src/router/index.js` 下编写统一导出路由的方法。

## 1 编写统一导出脚本

`src/router/index.js`

```js
// 统一导出所有路由模块
const fs = require('fs')

const Router = require('koa-router')
const router = new Router()

// 拿到当前文件夹下的所有文件名
fs.readdirSync(__dirname).forEach(file => {
  // console.log(file)
  if (file !== 'index.js') {
    let r = require('./' + file)
    // 路由也可以注册中间件，把所有导出的路由都放到中间件下
    router.use(r.routes())
  }
})

module.exports = router
```

## 2 使用统一导出的路由

`src/app/index.js`

```js
const Koa = require('koa')

const KoaBody = require('koa-body')

const errHandler = require('./errHandler')
// 导入统一导出的路由
const router = require('../router')

const app = new Koa()


app.use(KoaBody())
// 注册统一导出的路由
app.use(router.routes())
// http请求方式不支持时 跑下面的中间件，给客户端报501 错误
app.use(router.allowedMethods())

app.on('error', errHandler)

module.exports = app
```

# 十五、封装管理员权限

## 1  只有管理员才能上传图片

`router/goods.route.js`

```js
const Router = require('koa-router')

const { auth, hadAdminPermission } = require('../middleware/auth.middleware')

const { upload } = require('../controller/goods.controller')

const router = new Router({ prefix: '/goods' })
// 封装管理员权限 hadAdminPermission 
router.post('/upload', auth, hadAdminPermission, upload)

module.exports = router
```

## 2 判断是否为管理员

`src/middleware/auth.middleware.js`

```js
const hadAdminPermission = async (ctx, next) => {
  const { is_admin } = ctx.state.user
  if (!is_admin) {
    console.error('该用户没有管理员的权限', ctx.state.user)
    return ctx.app.emit('error', hasNotAdminPermission, ctx)
  }
  await next()
}
```

# 十六、文件上传

## 1 给 KoaBody 增加上传文件配置选项

`src/app/index.js`

```js
const path = require('path')

const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')

const errHandler = require('./errHandler')
const router = require('../router')
const app = new Koa()

// 增加上传文件配置选项
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
app.use(router.routes())
app.use(router.allowedMethods())
app.on('error', errHandler)

module.exports = app
```

## 2 在请求体里面拿到上传的文件

`src/controller/goods.controller.js`

```js
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
```

## 3 检查文件类型是否符合要求

这种方式判断不是最优解，因为不匹配文件还是会上传到服务器。

应该用 koa-body 所带的方法来判断

`src/controller/goods.controller.js`

```js
const path = require('path')
const { fileUploadError, unSupportedFileType } = require('../constant/err.type')
class GoodsController {
  async upload(ctx, next) {
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
          goods_img: path.basename(file.filepath)
        }
      }
    } else {
      return ctx.app.emit('error', fileUploadError, ctx)
    }
  }
}

module.exports = new GoodsController()
```

# 十七、集成统一的参数格式校验

## 1 利用第三方包 koa-parameter

```
npm i koa-parameter
```



## 2 导入第三方包

`src/app/index.js`

```js
const path = require('path')

const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')
// 导入参数校验包
const parameter = require('koa-parameter')
const errHandler = require('./errHandler')
const router = require('../router')

const app = new Koa()


app.use(KoaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '../upload'),
    keepExtensions: true
  }
}))
app.use(KoaStatic(path.join(__dirname, '../upload')))
// 注册参数校验包
app.use(parameter(app))
app.use(router.routes())
app.use(router.allowedMethods())

app.on('error', errHandler)

module.exports = app
```



## 3 制定参数规则

`src/middleware/goods.middleware.js`

```js
const { goodsFormatError } = require('../constant/err.type')
const validator = async (ctx, next) => {
  try {
    // 制定参数规则
    ctx.verifyParams({
      goods_name: { type: 'string', required: true },
      goods_price: { type: 'number', required: true },
      goods_num: { type: 'number', required: true },
      goods_img: { type: 'string', required: true }
    })
  } catch (err) {
    console.error(err)
    // 将错误信息写入到错误对象中，这样返回的错误信息会更加详细友好
    goodsFormatError.result = err
    return ctx.app.emit('error', goodsFormatError, ctx)
  }
  await next()
}

module.exports = {
  validator
}
```

# 十八、发布商品写入数据库

## 1 打通流程

`src/router/goods.route.js`

```js
// 发布商品接口 
// create 方法 写入数据到数据库
router.post('/', auth, hadAdminPermission, validator, create)
```

`src/controller/goods.controller.js`

```js
const path = require('path')
const { fileUploadError, unSupportedFileType, publishGoodsError } = require('../constant/err.type')
// 导入 createGoods 方法
const { createGoods } = require('../service/goods.service')

class GoodsController {
   // ... 
    
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
}

module.exports = new GoodsController()
```

`src/service/goods.service.js`

```js
// 将商品写入数据库
const Goods = require('../model/goods.model')
class GoodsService {
  async createGoods(goods) {
    const res = await Goods.create(goods)
    return res.dataValues
  }
}

module.exports = new GoodsService()
```

## 2 创建商品表

`src/model/goods.model.js`

```js
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

const Goods = seq.define('Goods', {
  goods_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品名称'
  },
  goods_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '商品价格'
  },
  goods_num: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品库存'
  },
  goods_img: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品图片url'
  }
})

// node ./src/model/goods.model.js 执行创建表
// Goods.sync({ force: true })

module.exports = Goods
```

# 十九、修改商品信息

## 1 添加修改商品接口

`src/router/goods.route.js`

```js
const Router = require('koa-router')

const { auth, hadAdminPermission } = require('../middleware/auth.middleware')

const { validator } = require('../middleware/goods.middleware')

const { upload, create, update } = require('../controller/goods.controller')

const router = new Router({ prefix: '/goods' })

router.post('/upload', auth, hadAdminPermission, upload)

router.post('/', auth, hadAdminPermission, validator, create)

// 修改商品接口
router.put('/:id', auth, hadAdminPermission, validator, update)


module.exports = router
```

## 2 添加修改商品方法

`src/controller/goods.controller.js`

```js
const path = require('path')
const { fileUploadError, unSupportedFileType, publishGoodsError, updateGoodsError, invalidGoodsID } = require('../constant/err.type')
const { createGoods, updateGoods } = require('../service/goods.service')

class GoodsController {
  // 修改商品信息方法
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
```

## 3 操作数据库修改商品信息

```js
const Goods = require('../model/goods.model')
class GoodsService {
  async createGoods(goods) {
    const res = await Goods.create(goods)
    return res.dataValues
  }
  // 修改商品信息
  async updateGoods(id, goods) {
    const res = await Goods.update(goods, { where: { id } })
    console.log(res)
    return res[0] > 0 ? true : false
  }
}

module.exports = new GoodsService()
```

# 二十、硬删除商品接口

> 不常用，一般使用软删除

## 1 添加硬删除接口

`src/router/goods.route.js`

```js
// 硬删除接口
router.delete('/:id', auth, hadAdminPermission, remove)
```

## 2 硬删除接口方法

`src/controller/goods.controller.js`

```js
const path = require('path')
const { fileUploadError, unSupportedFileType, publishGoodsError, updateGoodsError, invalidGoodsID } = require('../constant/err.type')
const { createGoods, updateGoods, removeGoods } = require('../service/goods.service')

class GoodsController {
  // 硬删除接口方法
  async remove(ctx) {
    const res = await removeGoods(ctx.params.id)
    ctx.body = {
      code: 0,
      message: '删除商品成功',
      result: ''
    }
  }
}

module.exports = new GoodsController()
```

## 3 操作数据库删除数据

`src/service/goods.service.js`

```js
const Goods = require('../model/goods.model')
class GoodsService {
  // 删除商品
  async removeGoods(id) {
    const res = await Goods.destroy({ where: { id } })
    return res[0] > 0 ? true : false
  }
}
module.exports = new GoodsService()
```

# 二十一、商品下架（软删除）

## 1 在模型中添加软删除配置项

`src/model/goods.model.js`

```js
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

const Goods = seq.define('Goods', {
  goods_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品名称'
  },
  goods_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '商品价格'
  },
  goods_num: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品库存'
  },
  goods_img: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品图片url'
  }
}, {
  // 添加软删除配置项
  paranoid: true
})

// node ./src/model/goods.model.js 执行创建表
// Goods.sync({ force: true })

module.exports = Goods
```

## 2 添加软删除接口

`src/router/goods.route.js`

```js
// 下架接口 
// off 下架
router.post('/:id/off', auth, hadAdminPermission, remove)
```

## 3 添加软删除方法

`src/controller/goods.controller.js`

```js
const path = require('path')
const { fileUploadError, unSupportedFileType, publishGoodsError, updateGoodsError, invalidGoodsID, removeGoodsFailed } = require('../constant/err.type')
const { createGoods, updateGoods, removeGoods } = require('../service/goods.service')

class GoodsController {
  // 下架或软删除方法
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
}

module.exports = new GoodsController()
```

## 4 操作数据库下架商品

`src/service/goods.service.js`

```js
const Goods = require('../model/goods.model')
class GoodsService {
  async createGoods(goods) {
    const res = await Goods.create(goods)
    return res.dataValues
  }

  async updateGoods(id, goods) {
    const res = await Goods.update(goods, { where: { id } })
    console.log(res)
    return res[0] > 0 ? true : false
  }
  // 删除商品
  async removeGoods(id) {
    const res = await Goods.destroy({ where: { id } })
    return res > 0 ? true : false
  }
}

module.exports = new GoodsService()
```

# 二十二、商品上架

## 1 添加商品上架接口

`src/router/goods.route.js`

```js
// 上架接口
router.post('/:id/on', auth, hadAdminPermission, restore)
```



## 2 添加商品上架方法

`src/controller/goods.controller.js`

```js
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
```



## 3 操作数据库上架商品

`src/service/goods.service.js`

```js
  // 上架商品
  async restoreGoods(id) {
    const res = await Goods.restore({
      where: { id }
    })
    return res > 0 ? true : false
  }
```

# 二十三、获取商品列表

## 1 添加获取商品列表接口

`src/router/goods.service.js`

```js
// 获取商品列表
router.get('/', findAll)
```

## 2 添加获取商品列表方法

`src/controller/goods.controller.js`

```js
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
```

## 3 操作数据库获取商品列表

`src/service/goods.service.js`

```js
  // 查找所有商品
  async findGoods(pageNum, pageSize) {
    // // 1. 获取总数
    // const count = await Goods.count()
    // // 2. 获取分页的具体数据
    // const offset = (pageNum - 1) * pageSize
    // // offset 偏移量, limit 每页显示多少条
    // const rows = await Goods.findAll({ offset: offset, limit: pageSize * 1 })

    // 联合起来的api用法
    const offset = (pageNum - 1) * pageSize
    const { count, rows } = await Goods.findAndCountAll({ offset: offset, limit: pageSize * 1 })
    return {
      pageNum,
      pageSize,
      total: count,
      list: rows
    }
  }
```

# 二十四、添加到购物车前的校验

## 1 创建购物车路由文件并添加接口

`src/router/car.route.js`

```js
// 1. 导入koa-router
const Router = require('koa-router')

// 中间件
const { auth } = require('../middleware/auth.middleware')
const { validator } = require('../middleware/cart.middleware')
// 控制器

// 2. 实例化router对象
const router = new Router({ prefix: '/carts' })

// 3. 编写路由规则

// 3.1 添加到购物车接口：登陆，格式
router.post('/', auth, validator, (ctx) => {
  ctx.body = '添加成功'
})

// 4. 导出router对象 
module.exports = router

```

## 2 添加到购物车参数验证

`src/middleware/cart.middleware.js`

```js
const { invalidGoodsID } = require('../constant/err.type')
const validator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      // 验证参数
      goods_id: { type: 'number', required: true }
    })
  } catch (err) {
    console.error(err)
    invalidGoodsID.result = err
    return ctx.app.emit('error', invalidGoodsID, ctx)
  }
  await next()
}

module.exports = {
  validator
}
```

# 二十五、添加到购物车方法实现

## 1 添加到购物车方法使用

`src/router/car.route.js`

`add方法`

```js
// 1. 导入koa-router
const Router = require('koa-router')

// 中间件
const { auth } = require('../middleware/auth.middleware')
const { validator } = require('../middleware/cart.middleware')

// 控制器
const { add } = require('../controller/cart.controller')

// 2. 实例化router对象
const router = new Router({ prefix: '/carts' })

// 3. 编写路由规则

// 3.1 添加到购物车接口：登陆，格式
router.post('/', auth, validator, add)

// 4. 导出router对象 
module.exports = router

```

## 2 添加到购物车方法

新建 `src/controller/cart.controller.js`

```js
const { createOrUpdate } = require('../service/cart.service')

class CartController {
  async add(ctx) {
    // 将商品添加到购物车
    // 1. 解析 user_id, goods_id
    const user_id = ctx.state.user.id
    const goods_id = ctx.request.body.goods_id
    // 2. 操作数据库
    const res = await createOrUpdate(user_id, goods_id)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '添加到购物车成功',
      result: res
    }
  }
}

module.exports = new CartController()
```

## 3 添加操作数据方法

新建 `src/service/cart.service.js`

```js
class CartService {
  async createOrUpdate(user_id, goods_id) {
    // 返回假数据用于测试
    return {
      id: 1,
      user_id: 13,
      goods_id: 1,
      number: 1,
      selected: true
    }
  }
}

module.exports = new CartService()
```

# 二十六、添加到购物车操作数据库方法实现

## 1 创建购物车模型（数据表）

新建`src/model/cart.model.js`

```js
// 1. 导入sequelize的链接
const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

// 2. 定义Cart模型
const Cart = seq.define('Carts', {
  goods_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品id'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户id'
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '商品数量'
  },
  selected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否选中'
  }
})

// 3. 同步数据（建表）
// node ./src/model/cart.model.js 执行创建表
// Cart.sync({ force: true })

// 4. 导出Cart模型
module.exports = Cart
```

## 2 操作数据库添加到购物车方法

`src/cart.service.js`

```js
const { Op } = require('sequelize')
const Cart = require('../model/cart.model')

class CartService {
  async createOrUpdate(user_id, goods_id) {
    // 根据 user_id && goods_id 一起查找，有没有记录
    let res = await Cart.findOne({
      where: {
         // 多条件联合查询语法
        [Op.and]: {
          user_id,
          goods_id
        }
      }
    })
    if (res) {
      // 已经存在一条记录，将 number(商品数量) 增加 1 
      await res.increment('number')
      // 读取更新以后的结果再返回
      return await res.reload()
    } else {
      return await Cart.create({
        user_id,
        goods_id
      })
    }
  }
}

module.exports = new CartService()
```

tips：此方法尚未完善，应先检验商品 id 是否存在

# 二十六、获取购物车列表

## 1 添加获取购物车列表接口

`src/router/cart.route.js`

```js
// 3.2 获取购物车列表
router.get('/', auth, findAll)
```

## 2 添加获取购物车列表方法

`src/controller/cart.controller.js`

```js
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
```

## 3 添加获取购物车列表操作数据库的方法

### 此处涉及到多表联合查询

`src/service/cart.service.js`

```js
const Cart = require('../model/cart.model')
const Goods = require('../model/goods.model')

class CartService {
  async findCarts(pageNum, pageSize) {
    const offset = (pageNum - 1) * pageSize
    const { count, rows } = await Cart.findAndCountAll({
      // 需要的字段
      attributes: ['id', 'number', 'selected'],
      offset: offset,
      limit: pageSize * 1,
      // 查除了自己表内的数据外还要查 Goods 表里的数据
      include: {
        model: Goods,
        as: 'goods_info',
        // 需要的字段
        attributes: ['id', 'goods_name', 'goods_img']
      }
    })
    return {
      pageNum,
      pageSize,
      total: count,
      list: rows
    }
  }
}

module.exports = new CartService()
```

### 多表联合查询需要在模型中添加配置项 (关联数据库)

`src/model/cart.model.js`

```js
// 1. 导入sequelize的链接
const { DataTypes } = require('sequelize')
const seq = require('../db/seq')
const Goods = require('./goods.model')

// 2. 定义Cart模型
const Cart = seq.define('Carts', {
  goods_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品id'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户id'
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '商品数量'
  },
  selected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否选中'
  }
})

// 3. 同步数据（建表）
// node ./src/model/cart.model.js 执行创建表
// Cart.sync({ force: true })

// 关联数据库
// 意思就是：Cart表中有 goods_id键 是属于Goods的
Cart.belongsTo(Goods, {
  // 外键
  foreignKey: 'goods_id',
  // 设置返回数据的别名, 不然会默认为 Good
  // 注意：查询的时候 includes 要定义为
  // includes: {
  //   model: Goods,
  //   as: 'goods_info'
  // }
  as: 'goods_info'
})

// 4. 导出Cart模型
module.exports = Cart
```

# 二十七、更新购物车

## 1 添加更新购物车路由

`src/router/cart.service.js`

```js
// 3.3 更新购物车
router.patch('/:id', auth, validator({
  number: { type: 'number', required: false }, selected: { type: 'bool', required: false }
}), update)
```

优化了 validator 参数校验中间件函数

`src/middleware/cart.middleware.js`

```js
const { invalidGoodsID, cartFormatError } = require('../constant/err.type')
// 原校验函数
// const validator = async (ctx, next) => {
//   try {
//     ctx.verifyParams({
//       goods_id: { type: 'number', required: true }
//     })
//   } catch (err) {
//     console.error(err)
//     invalidGoodsID.result = err
//     return ctx.app.emit('error', invalidGoodsID, ctx)
//   }
//   await next()
// }

// 优化校验函数
const validator = (rules) => {
  // 利用了闭包，因为函数内部rules 引用了 参数的rules
  return async (ctx, next) => {
    try {
      ctx.verifyParams(rules)
    } catch (err) {
      console.error(err)
      cartFormatError.result = err
      return ctx.app.emit('error', cartFormatError, ctx)
    }
    await next()
  }
}

module.exports = {
  validator
}
```

## 2 添加更新购物车方法

`src/controller/cart.controller.js`

```js
  async update(ctx) {
    // 1. 解析参数
    const id = ctx.request.params.id
    const { number, selected } = ctx.request.body
    // 判断两个参数是否都为空
    if (number === undefined && selected === undefined) {
      cartFormatError.message = 'number和selected不能同时为空'
      return ctx.app.emit('error', cartFormatError, ctx)
    }
    // 2. 操作数据库
    const res = await updateCarts({ id, number, selected })

    // 3. 返回数据
    ctx.body = {
      code: 0,
      message: '更新购物车成功',
      result: res
    }
  }
```

## 3 添加更新购物车操作数据库的方法

`src/service/cart.service.js`

```js
  async updateCarts(params) {
    const { id, number, selected } = params
    // Model.findByPk(1) 等同于 Model.findOne({primaryKey: 1})，需要自己指定主键
    const res = await Cart.findByPk(id)

    if (!res) return ''

    number !== undefined ? (res.number = number) : ''

    selected !== undefined ? (res.selected = selected) : ''

    // 更新数据
    return await res.save()
  }
```

# 二十八、删除购物车商品

## 1 添加删除购物车商品接口

`src/router/cart.route.js`

```js
// 3.4 删除购物车
router.delete('/', auth, validator({ ids: 'array' }), remove)
```

## 2 添加删除购物车商品方法

`src/cart.controller.js`

```js
  async remove(ctx) {
    const { ids } = ctx.request.body
    const res = await removeCarts(ids)

    ctx.body = {
      code: 0,
      message: '删除购物车成功',
      result: res
    }
  }
```

## 3 操作数据库删除购物车商品

`src/cart.service.js`

```js
  async removeCarts(ids) {
    return await Cart.destroy({
      where: {
        id: {
          // 批量查找 ids为数组
          [Op.in]: ids
        }
      }
    })
  }
```

# 二十九、购物车的 全选 与 全不选

## 1  添加 全选/不选 接口

`src/router/cart.route.js`

```js
// 3.5 全选 与 全不选
router.post('/selectAll', auth, selectAll)
router.post('/unselectAll', auth, unselectAll)
```

## 2 添加 全选 /不选 方法

`src/controller/cart.controller.js`

```js
  async selectAll(ctx) {
    const user_id = ctx.state.user.id
    const res = await selectAllCarts(user_id)
    ctx.body = {
      code: 0,
      message: '全部选中',
      result: res
    }
  }

  async unselectAll(ctx) {
    const user_id = ctx.state.user.id
    const res = await unselectAllCarts(user_id)
    ctx.body = {
      code: 0,
      message: '全部不选中',
      result: res
    }
  }
```

## 3 添加 全选 /不选 操作数据库方法

`src/cart.service.js`

```js
  async selectAllCarts(user_id) {
    return await Cart.update(
      { selected: true },
      {
        where: {
          user_id
        }
      }
    )
  }

  async unselectAllCarts(user_id) {
    return await Cart.update(
      { selected: false },
      {
        where: {
          user_id
        }
      }
    )
  }
```

优化点：可进一步优化为一个接口

# 三十、添加收货地址接口

## 1 添加收获地址接口

`src/router/addr.route.js`

```js
// 1. 导入koa-router包
const Router = require('koa-router')

// 2. 实例化对象
const router = new Router({ prefix: '/address' })

// 中间件/控制器
const { auth } = require('../middleware/auth.middleware')
const { validator } = require('../middleware/addr.middleware')

// 3. 编写路由规则

// 3.1 添加接口： 需登陆，格式等校验
router.post('/', auth, validator({
  consignee: 'string', phone: {
    type: 'string',
    // format：正则表达式
    format: /^1\d{10}$/
  }
}), ctx => {
  ctx.body = 'q'
})



// 4. 导出router对象
module.exports = router
```

## 2 添加收获地址参数验证中间件

`src/middleware/addr.middle.js`

```js
const { addrFormatError } = require('../constant/err.type')
const validator = (rules) => {
  return async (ctx, next) => {
    try {
      await ctx.verifyParams(rules)
    } catch (err) {
      console.error(err)
      addrFormatError.result = err
      return ctx.app.emit('error', addrFormatError, ctx)
    }
    await next()
  }
}

module.exports = {
  validator
}
```

## 3 添加收获地址方法

`src/controller/addr.controller.js`

```js
const { createAddr } = require('../service/addr.service')
class AddrController {
  async create(ctx) {
    // 解析 user_id, consignee, phone, address
    const user_id = ctx.state.user.id
    const { consignee, phone, address } = ctx.request.body
    const res = await createAddr({ user_id, consignee, phone, address })
    ctx.body = {
      code: 0,
      message: '添加地址成功',
      result: res
    }
  }
}

module.exports = new AddrController()
```

## 4 操作数据库添加收货地址

`src/service/addr.service.js`

```js
const Address = require('../model/addr.model')
class AddrService {
  async createAddr(addr) {
    return await Address.create(addr)
  }
}

module.exports = new AddrService()
```

## 5 添加收获地址数据表模型

`src/model/addr.model.js`

```js
const { DataTypes } = require('sequelize')
// 1. 导入seq的连接
const seq = require('../db/seq')
// 2. 定义字段
const Address = seq.define('addresses', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户id'
  },
  consignee: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '收货人姓名'
  },
  phone: {
    type: DataTypes.CHAR(11),
    allowNull: false,
    comment: '收货人的手机号'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '收货人的地址',
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否为默认地址, 0:不是(默认) 1: 是'
  }
})
// 3. 同步，sync
// Address.sync({ force: true })

// 4. 导出模型对象
module.exports = Address
```

# 三十一、获取地址列表接口

## 1 添加获取地址列表接口

`src/route/addr.route.js`

```js
// 3.2 获取地址列表
router.get('/', auth, findAll)
```

## 2 添加获取列表地址方法

`src/controller/addr.controller.js`

```js
  async findAll(ctx) {
    const user_id = ctx.state.user.id
    const res = await findAllAddr(user_id)
    ctx.body = {
      code: 0,
      message: '获取列表成功',
      result: res
    }
  }
```

## 3 操作数据库获取地址列表

`src/service/addr.service.js`

```js
  async findAllAddr(user_id) {
    return await Address.findAll({
      attributes: ['id', 'consignee', 'phone', 'address', 'is_default'],
      where: { user_id }
    })
  }
```

# 三十二、删除地址接口

## 1 添加删除地址接口

`src/router/addr.route.js`

```js
// 3.4 删除地址
router.delete('/:id', auth, remove)
```

## 2 添加删除地址方法

`src/controller/addr.controller.js`

```js
  async remove(ctx) {
    const id = ctx.request.params.id
    const res = await removeAddr(id)

    ctx.body = {
      code: 0,
      message: '删除地址成功',
      result: res
    }
  }
```

## 3 操作数据库删除地址

`src/service/addr.service.js`

```js
  async removeAddr(id) {
    return await Address.destroy({
      where: {
        id
      }
    })
  }
```

# 三十三、设置默认地址接口

## 1 添加设置默认地址接口

`src/router/addr.route.js`

```js
// 3.5 设置默认地址
router.patch('/:id', auth, setDefault)
```

## 2 添加设置默认地址方法

`src/controller/addr.controller.js`

```js
  async setDefault(ctx) {
    const user_id = ctx.state.user.id
    const id = ctx.request.params.id
    const res = await setDefaultAddr(user_id, id)

    ctx.body = {
      code: 0,
      message: '设置默认成功',
      result: res
    }
  }
```

## 3 操作数据库设置默认地址

`src/service/addr.service.js`

```js
// 排他思想  
async setDefaultAddr(user_id, id) {
    // 先把所有地址设置为 false
    await Address.update({ is_default: false }, {
      where: {
        user_id,
      }
    })
    // 再将指定的地址设置为默认
    return await Address.update({ is_default: true }, {
      where: {
        id
      }
    })
  }
```

