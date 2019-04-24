const router = require('koa-router')()
const userctrl = require('../controllers/userController')
const Joi = require('joi')
const validate = require('koa2-validation')

const userValidate = {
  register: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  findUserById: {
    params: {
      _id: Joi.string().hex().required()
    }
  },
  findList: {
    query: {
      companyName: Joi.string()
    }
  },
  updateUser: {
    params: {
      _id: Joi.string().hex().required()
    },
    body: {
      username: Joi.string(),
      password: Joi.string()
    }
  }
}

router.prefix('/user')

router
  .post('/register', validate(userValidate.register), userctrl.register)
  .post('/login', validate(userValidate.login), userctrl.login)
  .get('/findUserByName', userctrl.findUserByName)
  .get('/own', userctrl.own)
  .get('/:_id', userctrl.findUserById)
  .get('/', validate(userValidate.findList), userctrl.findList)
  .put('/:_id', validate(userValidate.updateUser), userctrl.updateUser)

module.exports = router
