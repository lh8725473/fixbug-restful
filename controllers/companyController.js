const companyModel = require('../models/company')

class CompanyController {
  // 增加公司
  async addCompany (ctx) {
    const postData = ctx.request.body
    const data = await companyModel.save(postData)
    ctx.body = {
      data: data
    }
  }

  // 公司列表
  async companyList (ctx) {
    const companyList = await companyModel.companyList()
    ctx.body = {
      code: 1,
      companyList: companyList
    }
  }
}

module.exports = new CompanyController()
