const mongoose = require('mongoose')
// 一个角色模型
const RoleSchema = new mongoose.Schema({
  roleType: { type: String, required: true },
  roleName: { type: String, required: true },
  roleDec: { type: String },
  createdTime: {
    type: Date,
    default: Date.now
  },
  updatedTime: {
    type: Date,
    default: Date.now
  }
})
// 创建Model
const Role = mongoose.model('role', RoleSchema, 'role')

const RoleModel = {
  save: async (role) => {
    const newRole = new Role(role)
    const data = await newRole.save()
    return data
  },
  findOne: async (filter) => {
    const role = await Role.findOne(filter)
    return role
  }
}

module.exports = RoleModel
