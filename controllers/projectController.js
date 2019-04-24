const projectModel = require('../models/project')
const jwt = require('jsonwebtoken')
const util = require('util')
// const _ = require('lodash')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'jwt demo'

class ProjectController {
  // 增加项目
  async addProject (ctx) {
    const token = ctx.header.authorization
    let payload
    if (token) {
      payload = await verify(token.split(' ')[1], secret)
      const postData = ctx.request.body
      postData.creator = payload.userId
      postData.users = [payload.userId]
      const data = await projectModel.save(postData)
      ctx.body = {
        code: 1,
        data: data
      }
    } else {
      ctx.body = {
        message: '参数错误',
        code: -1
      }
    }
  }

  // 更新项目
  async updateProject (ctx) {
    const postData = ctx.request.body
    const projectId = ctx.request.body.projectId
    const data = await projectModel.updateProject(projectId, postData)
    ctx.body = {
      code: 1,
      data: data
    }
  }

  // 增加项目成员
  async addUserToProject (ctx) {
    const token = ctx.header.authorization
    if (token) {
      const projectId = ctx.request.body.projectId
      const postData = { $push: { users: ctx.request.body.userId } }

      const data = await projectModel.updateProject(projectId, postData)
      if (data) {
        ctx.body = {
          code: 1,
          data: data
        }
      } else {
        ctx.body = {
          message: '项目Id错误',
          code: -1
        }
      }
    } else {
      ctx.body = {
        message: '参数错误',
        code: -1
      }
    }
  }

  // 删除项目成员
  async removeUserToProject (ctx) {
    const token = ctx.header.authorization
    if (token) {
      const projectId = ctx.request.body.projectId
      const postData = { $pull: { users: ctx.request.body.userId } }

      const data = await projectModel.updateProject(projectId, postData)
      ctx.body = {
        code: 1,
        data: data
      }
    } else {
      ctx.body = {
        message: '参数错误',
        code: -1
      }
    }
  }

  // 项目列表
  async projectList (ctx) {
    const { searchWord } = ctx.request.query
    const filter = {
      users: { $in: [ctx.header.userId] }
    }
    if (searchWord) {
      filter.$or = [
        { projectName: { $regex: new RegExp(`${searchWord}`, 'g') } },
        { projectDec: { $regex: new RegExp(`${searchWord}`, 'g') } }
      ]
      // filter.projectName = { $regex: new RegExp(`${searchWord}`, 'g') }
    }
    const projectList = await projectModel.projectList(filter)
    ctx.body = {
      code: 1,
      projectList: projectList
    }
  }

  // 项目列表
  async projectUserList (ctx) {
    const { projectId } = ctx.request.query
    const filter = {
      _id: projectId
    }
    const userList = await projectModel.projectUserList(filter)
    ctx.body = {
      code: 1,
      userList: userList
    }
  }
}

module.exports = new ProjectController()
