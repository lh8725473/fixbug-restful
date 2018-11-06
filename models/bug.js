const mongoose = require('mongoose')
// 一个项bug模型
const BugSchema = new mongoose.Schema({
  bugNum: { type: Number, required: true }, // 项目编号
  title: { type: String, required: true },
  priority: { type: String, required: true }, // 普通 紧急 非常紧急 严重
  status: { type: String, required: true }, // 未修复 待审核 已解决 已关闭
  bugDec: { type: String, required: true },
  createdTime: {
    type: Date,
    default: Date.now
  },
  updatedTime: {
    type: Date,
    default: Date.now
  },
  project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'project' }, // 关联项目
  disposeUser: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' }, // 当前处理人
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' } // 创建者
})
// 创建Model
const Bug = mongoose.model('bug', BugSchema, 'bug')

const BugModel = {
  save: async (bug) => {
    const newbug = new Bug(bug)
    const data = await newbug.save()
    return data
  },
  updatebug: async (_id, updateData) => {
    updateData.updatedTime = new Date()
    const data = await Bug.findOneAndUpdate({ _id: _id }, updateData, { 'new': true })
    return data
  },
  findBugById: async (_id) => {
    const data = await Bug.findById(_id).lean()
    return data
  },
  findOne: async (filter) => {
    const bug = await Bug.findOne(filter)
    return bug
  },
  bugList: async (filter) => {
    const bug = await Bug.find(filter)
      .populate('creator')
      .sort({ createdTime: -1 })
      // .limit(+limit)
      // .skip(+skip)
      .lean()
      .exec()
    return bug
  },
  count: async (filter) => {
    const total = await Bug.countDocuments(filter)
    return total
  }
}

module.exports = BugModel
