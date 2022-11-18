const Sequelize = require("sequelize");

const config = require("../config/database");

const User = require("../app/models/User");
const Vaga = require("../app/models/Vaga");
const Candidate = require("../app/models/Candidate");
const VagasCandidate = require("../app/models/VagaCandidate");

const models = [User, Vaga, Candidate, VagasCandidate];

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
