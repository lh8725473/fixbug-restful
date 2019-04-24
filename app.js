const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const path = require('path')
const koaStatic = require('koa-static')
const koaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'jwt demo'

const index = require('./routes/index')
const user = require('./routes/user')
const role = require('./routes/role')
const company = require('./routes/company')
const article = require('./routes/article')
const project = require('./routes/project')
const bug = require('./routes/bug')

// error handler
onerror(app)

// middlewares
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}))

// 静态资源目录对于相对入口文件app.js的路径
const staticPath = './public'
app.use(koaStatic(
  path.join(__dirname, staticPath)
))

// app.use(bodyparser({
//   multipart: true,
//   formidable: {
//     maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
//   },
//   enableTypes: ['json', 'form', 'text']
// }))

app.use(json())
app.use(cors())

app.use(koaJwt({ secret }).unless({
  path: [/^\/user\/login/, /^\/user\/register/, /^\/user\/uploadFile/, /^\/user\/uploadFileNew/, /^\/user\/mergeFile/, /^\/mergeFile/, /^\/upload/] // 数组中的路径不需要通过jwt验证
}))

app.use((ctx, next) => {
  return next().catch((err) => {
    console.log(err)
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = 'Protected resource, use Authorization header to get access\n'
    } else {
      throw err
    }
  })
})

// app.use(koaJwt({ secret }).unless({
//   path: [/^\/user\/login/, /^\/user\/register/, /^\/upload/] // 数组中的路径不需要通过jwt验证
// }))

app.use(logger())

// console.log('__dirname', __dirname)
// app.use(views(__dirname + '/public'))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(ctx.body)
//   ctx.body.time = `${ms}ms`
// })

// trans page & pageSize to skip & limit
app.use(async (ctx, next) => {
  if (ctx.request.query.pageSize || ctx.request.query.pageNum) {
    const { pageNum = 1, pageSize = 10 } = ctx.request.query
    ctx.request.query.limit = pageSize
    ctx.request.query.skip = pageSize * (pageNum - 1)
  }
  await next()
})

// 通过jtwToken获取userId
app.use(async (ctx, next) => {
  const token = ctx.header.authorization
  let payload
  if (token) {
    payload = await verify(token.split(' ')[1], secret)
    ctx.header.userId = payload.userId
  }
  await next()
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(role.routes(), role.allowedMethods())
app.use(company.routes(), company.allowedMethods())
app.use(article.routes(), article.allowedMethods())
app.use(project.routes(), project.allowedMethods())
app.use(bug.routes(), bug.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  // console.error('server error', err, ctx)
  // console.error(err)
  // console.error(err.message)
  // console.error(ctx)
  ctx.body = {
    code: -1,
    message: err.message
  }
})

module.exports = app
