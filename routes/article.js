const router = require('koa-router')()
const articleCtrl = require('../controllers/articleController')

router.prefix('/article')

router.post('/', articleCtrl.addArticle)
// router.post('/login', companyCtrl.login)
// router.get('/:_id', companyCtrl.findUser)
router.get('/', articleCtrl.articleList)

module.exports = router
