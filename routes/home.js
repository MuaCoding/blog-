const PostModel = require('../models/post')
const CategoryModel = require('../models/category')


module.exports = {
  async index(ctx,next) {
    const posts = await PostModel.find({})
    const categories = await CategoryModel.find({}).limit(5)

    await ctx.render('index',{
      title: 'node learn',
      desc: 'welcome node blog',
      // posts,
      // categories
    })
  }
}
