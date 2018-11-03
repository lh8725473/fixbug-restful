var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var db = mongoose.connect('mongodb://localhost:27017/koa2-api2', { useNewUrlParser: true })
module.exports = db
