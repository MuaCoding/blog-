const Koa = require('koa');
const path = require('path')
const views = require('koa-views')
const router = require('./routes')

const app = new Koa();

// router(app)

app.use(views(path.join(__dirname, 'views'), {
  map: { html: 'nunjucks' }
}))

app.listen(4000, () => {
  console.log('server is running at http://localhost:4000')
})
