require("dotenv-safe").config();

module.exports = {
  up: (Sequelize) => Sequelize.createSchema(process.env.DB_SCHEMA),

  down: (Sequelize) => Sequelize.dropSchema(process.env.DB_SCHEMA),
};
