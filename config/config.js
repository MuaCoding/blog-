module.exports = {
  port: process.env.PORT || 4000,
  session:{
    key: 'jszen',
    maxAge: 86400000
  },
  // mongodb: 'mongodb://localhost:27017/jszen'
  mongodb: 'mongodb://172.17.0.1:27017/test'
}
