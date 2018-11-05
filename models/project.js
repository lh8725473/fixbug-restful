const mongoose = require('mongoose')
// 一个项目模型
const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectDec: { type: String },
  createdTime: {
    type: Date,
    default: Date.now
  },
  updatedTime: {
    type: Date,
    default: Date.now
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' }], // 项目成员
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' } // 创建者
})
// 创建Model
const Project = mongoose.model('project', ProjectSchema, 'project')

const ProjectModel = {
  save: async (project) => {
    const newProject = new Project(project)
    const data = await newProject.save()
    return data
  },
  updateProject: async (_id, updateData) => {
    updateData.updatedTime = new Date()
    const data = await Project.findOneAndUpdate({ _id: _id }, updateData, { 'new': true })
    return data
  },
  findOne: async (filter) => {
    const project = await Project.findOne(filter)
    return project
  },
  projectList: async (filter) => {
    const project = await Project.find(filter)
      .populate('creator')
      .sort({ createdTime: -1 })
      // .limit(+limit)
      // .skip(+skip)
      .lean()
      .exec()
    return project
  }
}

module.exports = ProjectModel
