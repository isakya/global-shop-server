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