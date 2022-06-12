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

  // 参数传对象的原因是为了可以让参数和参数顺序不那么固定
  async updateById({ id, user_name, password, is_admin }) {
    const whereOpt = { id }
    const newUser = {}
    user_name && Object.assign(newUser, { user_name })
    password && Object.assign(newUser, { password })
    is_admin && Object.assign(newUser, { is_admin })

    const res = await User.update(newUser, { where: whereOpt })
    return res[0] > 0 ? true : new error()
  }
}

module.exports = new UserService()