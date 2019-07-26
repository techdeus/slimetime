require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    define: {
        timestamps: true,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false,
});

sequelize
  .authenticate()
  .then(() => {
      console.log('Connection is established');
  })
  .catch(err => console.log('Unable to connect to the database',));

// sequelize.close();

module.exports = sequelize;