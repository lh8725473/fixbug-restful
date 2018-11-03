const mongoose = require('mongoose')
// 一个行业数据模型
const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  plate: { type: String, required: true }, // 'industryData': 行业数据，'projectInformation': 项目信息
  professionalType: { type: String, required: true }, // '氢气制取等'
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  }
})
// 创建Model
const Article = mongoose.model('article', ArticleSchema, 'article')

const companyModel = {
  save: async (article) => {
    const newarticle = new Article(article)
    const data = await newarticle.save()
    return data
  },
  articleList: async (filter) => {
    const data = await Article.find(filter)
    console.log(data)
    return data
  },
  articleCount: async (filter) => {
    const total = await Article.countDocuments(filter)
    return total
  }
}
module.exports = companyModel
