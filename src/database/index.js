const Sequelize = require("sequelize");

const config = require("../config/database");

const User = require("../app/models/User");
const Vaga = require("../app/models/Vaga");

const models = [User, Vaga];

class Database {
  constructor() {
    this.connection = new Sequelize(config.development);
    this.init();
    this.associate();
  }

  init() {
    models.forEach((model) => model.init(this.connection));
  }

  associate() {
    models.forEach((model) => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

module.exports = new Database();
