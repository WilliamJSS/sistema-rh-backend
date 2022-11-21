const Sequelize = require("sequelize");
const { Model } = require("sequelize");

require("dotenv-safe").config();

class VagasCandidates extends Model {
  static init(sequelize) {
    super.init(
      {
        requisites: Sequelize.JSONB,
        quizStatus: Sequelize.STRING,
        quizNote: Sequelize.INTEGER,
        interviewed: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        underscored: true,
        name: {
          singular: "vagas_candidate",
          plural: "vagas_candidates",
        },
        schema: process.env.DB_SCHEMA,
      }
    );
  }
}

module.exports = VagasCandidates;
