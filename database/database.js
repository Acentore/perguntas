const Sequelize = require('sequelize')
const connection = new Sequelize('guiaperguntas', 'root', '1408', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = connection
