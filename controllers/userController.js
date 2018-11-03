const userModel = require('../models/user')
const roleModel = require('../models/role')
const companyModel = require('../models/company')
const articleModel = require('../models/article')
const jwt = require('jsonwebtoken')
const util = require('util')
// const _ = require('lodash')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'jwt demo'

class UserController {
  // 注册
  async register (ctx) {
    const postData = ctx.request.body
    const user = await userModel.findOne({ username: postData.username })
    if (user) {
      ctx.body = {
        code: -1,
        errorMsg: '用户名已存在！'
      }
    }
    const role = await roleModel.findOne({ roleType: postData.roleType })
    delete postData.roleType
    postData.role = role._id
    const data = await userModel.save(postData)
    ctx.body = {
      code: 1,
      data: data
    }
  }

  // 登录
  async login (ctx) {
    const postData = ctx.request.body
    const user = await userModel.findOne(postData)
    console.log(user)
    if (user) {
      let userToken = {
        userId: user._id
      }
      const token = jwt.sign(userToken, secret, { expiresIn: '24h' })
      ctx.body = {
        code: 1,
        user: user,
        token
      }
    } else {
      ctx.body = {
        code: -1,
        errorMsg: '用户或密码错误'
      }
    }
  }

  // token获取用户信息
  async own (ctx) {
    const token = ctx.header.authorization
    let payload
    if (token) {
      payload = await verify(token.split(' ')[1], secret)
      const user = await userModel.findUserById(payload.userId)
      ctx.body = {
        code: 1,
        user: user
      }
    } else {
      ctx.body = {
        message: '参数错误',
        code: -1
      }
    }
  }

  // 根据_id更新用户
  async updateUser (ctx) {
    console.log(ctx.params._id)
    console.log(ctx.request.body)
    const user = await userModel.updateUser(ctx.params._id, ctx.request.body)
    if (user) {
      ctx.body = {
        code: 1,
        user: user
      }
    } else {
      ctx.body = {
        code: -1,
        errorMsg: '没有找到对应_id用户'
      }
    }
  }

  // 用户列表
  async findList (ctx) {
    const { limit = 50, skip = 0, username, companyName, startTime, endTime } = ctx.request.query
    let filter = {}
    if (username) {
      filter.username = { $regex: new RegExp(`${username}`, 'g') }
    }
    if (startTime) {
      filter.createdTime = { $gt: startTime }
    }
    if (endTime) {
      filter.createdTime = { $lt: endTime }
    }
    if (companyName) {
      let companyFilter = {
        companyName: { $regex: new RegExp(`${companyName}`, 'g') }
      }
      const companyList = await companyModel.findList(companyFilter)
      const companyIds = companyList.map(company => {
        return company._id
      })
      filter.company = { $in: companyIds }
    }
    const userList = await userModel.findList(filter, limit, skip)
    userList.map(async (user) => {
      const articleCount = await articleModel.articleCount({ creator: user._id })
      user.articleCount = articleCount
    })
    const total = await userModel.count(filter)
    ctx.body = {
      code: 1,
      userList: userList,
      total: total
    }
  }

  // 根据_id查询用户
  async findUserById (ctx) {
    console.log(ctx.params._id)
    const user = await userModel.findUserById(ctx.params._id)
    if (user) {
      ctx.body = {
        code: 1,
        user: user
      }
    } else {
      ctx.body = {
        code: -1,
        errorMsg: '没有找到对应_id用户'
      }
    }
  }

  // 根据name查询用户
  async findUserByName (ctx) {
    console.log(ctx.query.username)
    const user = await userModel.findOne({ username: ctx.query.username })
    if (user) {
      ctx.body = {
        code: 1,
        user: user
      }
    } else {
      ctx.body = {
        code: 1,
        user: null
      }
    }
  }
}

module.exports = new UserController()
