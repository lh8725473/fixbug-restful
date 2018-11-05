const router = require('koa-router')()
const projectCtrl = require('../controllers/projectController')

router.prefix('/project')

router.post('/add', projectCtrl.addProject)
router.post('/update', projectCtrl.updateProject)
router.get('/list', projectCtrl.projectList)
router.post('/addUserToProject', projectCtrl.addUserToProject)
// router.get('/:_id', companyCtrl.findUser)
// router.get('/', companyCtrl.findList)

module.exports = router
