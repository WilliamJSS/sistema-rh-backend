const Sequelize = require("sequelize");

const config = require("../config/database");

const User = require("../app/models/User");

const models = [User];

class Database {
  constructor() {
    this.connection = new Sequelize(config.development);
    this.init();
  }

  init() {
    models.forEach((model) => model.init(this.connection));
  }
}

module.exports = new Database();
