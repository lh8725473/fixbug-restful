const mongoose = require('mongoose')
// 一个项bugFlow模型
const BugFlowSchema = new mongoose.Schema({
  bugFlowDec: { type: String }, // 流程详情
  curStatus: { type: String, required: true },
  bug: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'bug' }, // 对应bug
  fromUser: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' }, // 谁分配
  toUser: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' }, // 分配个谁
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
const BugFlow = mongoose.model('bugFlow', BugFlowSchema, 'bugFlow')

const BugFlowModel = {
  save: async (bugFlow) => {
    const newbugFlow = new BugFlow(bugFlow)
    const data = await newbugFlow.save()
    return data
  },
  updatebugFlow: async (_id, updateData) => {
    updateData.updatedTime = new Date()
    const data = await BugFlow.findOneAndUpdate({ _id: _id }, updateData, { 'new': true })
    return data
  },
  findOne: async (filter) => {
    const bugFlow = await BugFlow.findOne(filter)
    return bugFlow
  },
  bugFlowList: async (filter) => {
    const bugFlow = await BugFlow.find(filter)
      .populate('creator')
      .sort({ createdTime: -1 })
      // .limit(+limit)
      // .skip(+skip)
      .lean()
      .exec()
    return bugFlow
  }
}

module.exports = BugFlowModel
