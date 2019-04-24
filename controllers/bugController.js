const bugModel = require('../models/bug')
const bugFlowModel = require('../models/bugFlow')

class BugController {
  // 增加bug
  async addBug (ctx) {
    const userId = ctx.header.userId
    const postData = ctx.request.body
    postData.creator = userId
    postData.status = '未修复'
    const count = await bugModel.count()
    postData.bugNum = count + 1
    const data = await bugModel.save(postData)
    const bugFlowData = {
      bug: data._id,
      fromUser: userId,
      toUser: postData.disposeUser,
      curStatus: postData.status
    }
    await bugFlowModel.save(bugFlowData)
    ctx.body = {
      code: 1,
      data: data
    }
  }

  // 更新bug
  async updateBug (ctx) {
    const userId = ctx.header.userId
    const postData = ctx.request.body
    const bugId = ctx.request.body.bugId
    postData.updatedTime = Date.now
    const data = await bugModel.updatebug(bugId, postData)
    const bugFlowData = {
      bug: data._id,
      fromUser: userId,
      toUser: postData.disposeUser,
      curStatus: postData.status
    }
    await bugFlowModel.save(bugFlowData)
    ctx.body = {
      code: 1,
      data: data
    }
  }

  // 获取bug详情
  async getBugById (ctx) {
    const bugId = ctx.request.query.bugId
    // 典型 async/await 地狱
    // const data = await bugModel.findBugById(bugId)
    // const bugFlowList = await bugFlowModel.bugFlowList({ bug: bugId })
    // data.bugFlowList = bugFlowList
    // ctx.body = {
    //   code: 1,
    //   data: data
    // }
    const data = bugModel.findBugById(bugId)
    const bugFlowList = bugFlowModel.bugFlowList({ bug: bugId })
    await Promise.all([data, bugFlowList])
      .then((data) => {
        data[0].bugFlowList = data[1]
        ctx.body = {
          code: 1,
          data: data[0]
        }
      })
  }

  // 项目bug列表
  async bugList (ctx) {
    console.log(ctx.header.userId)
    const { limit = 50, skip = 0, projectId, type, priority, status, searchWord } = ctx.request.query
    let filter = {}
    filter.project = projectId
    if (type === 'own') {
      filter.creator = ctx.header.userId
    }
    if (type === 'toMe') {
      filter.disposeUser = ctx.header.userId
    }
    if (priority) {
      filter.priority = priority
    }
    if (status) {
      filter.status = status
    }
    if (searchWord) {
      filter.$or = [
        { title: { $regex: new RegExp(`${searchWord}`, 'g') } },
        { bugDec: { $regex: new RegExp(`${searchWord}`, 'g') } }
      ]
    }
    const bugList = await bugModel.bugList(filter, limit, skip)
    ctx.body = {
      code: 1,
      bugList: bugList
    }
  }
}

module.exports = new BugController()
