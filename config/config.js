module.exports = {
  port: process.env.PORT || 4000,
  session:{
    key: 'blog',
    maxAge: 86400000
  },
  // mongodb: 'mongodb://localhost:27017/jszen'
  mongodb: 'mongodb://localhost:27017/blog'
}
