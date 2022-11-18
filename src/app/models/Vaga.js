const Sequelize = require("sequelize");
const { Model } = require("sequelize");

require("dotenv-safe").config();

class Vaga extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        requisites: Sequelize.JSONB,
      },
      {
        sequelize,
        underscored: true,
        name: {
          singular: "vaga",
          plural: "vagas",
        },
        schema: process.env.DB_SCHEMA,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id" });
    this.belongsToMany(models.Candidate, {
      through: models.VagasCandidate,
    });
  }
}

module.exports = Vaga;
