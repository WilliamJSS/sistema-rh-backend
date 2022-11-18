const { Model } = require("sequelize");

require("dotenv-safe").config();

class VagasCandidate extends Model {
  static init(sequelize) {
    super.init(
      {},
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

module.exports = VagasCandidate;
