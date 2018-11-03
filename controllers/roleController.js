const roleModel = require('../models/role')

class RoleController {
  // 注册
  async addRole (ctx) {
    const postData = ctx.request.body
    const data = await roleModel.save(postData)
    ctx.body = {
      data: data
    }
  }
}

module.exports = new RoleController()
