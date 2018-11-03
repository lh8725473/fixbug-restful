const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const path = require('path')
const koaStatic = require('koa-static')

const index = require('./routes/index')
const user = require('./routes/user')
const role = require('./routes/role')
const company = require('./routes/company')
const article = require('./routes/article')

// error handler
onerror(app)

// middlewares
// 静态资源目录对于相对入口文件app.js的路径
const staticPath = './public'
console.log(path.join(__dirname, staticPath))
app.use(koaStatic(
  path.join(__dirname, staticPath)
))

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}))
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(cors())
// app.use(jwtKoa({secret}).unless({
//   path: [/^\/user\/login/] //数组中的路径不需要通过jwt验证
// }))

// app.use(function (ctx, next) {
//   return next().catch((err) => {
//     console.log(err)
//     if (err.status === 401) {
//       ctx.status = 401
//       ctx.body = 'Protected resource, use Authorization header to get access\n'
//     } else {
//       throw err
//     }
//   })
// })

// app.use(jwtKoa({ secret }).unless({
//   path: [/^\/user\/login/] // 数组中的路径不需要通过jwt验证
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
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
//   // ctx.body.times = `${ms}ms`
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

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(role.routes(), role.allowedMethods())
app.use(company.routes(), company.allowedMethods())
app.use(article.routes(), article.allowedMethods())

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
