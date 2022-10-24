const Sequelize = require("sequelize");

const config = require("../config/database");

class Database {
  constructor() {
    this.connection = new Sequelize(config.development);
  }
}

module.exports = new Database();
