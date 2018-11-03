const articleModel = require('../models/article')

class ArticleController {
  // 增加数据
  async addArticle (ctx) {
    const postData = ctx.request.body
    const data = await articleModel.save(postData)
    ctx.body = {
      data: data
    }
  }

  // 查询数据
  async articleList (ctx) {
    const articleList = await articleModel.articleList()
    ctx.body = {
      code: 1,
      articleList: articleList
    }
  }
}

module.exports = new ArticleController()
