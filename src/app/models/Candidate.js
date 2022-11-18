const Sequelize = require("sequelize");
const { Model } = require("sequelize");

require("dotenv-safe").config();

class Candidate extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
      },
      {
        sequelize,
        underscored: true,
        name: {
          singular: "candidate",
          plural: "candidates",
        },
        schema: process.env.DB_SCHEMA,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id" });
    this.belongsToMany(models.Vaga, {
      through: models.VagasCandidate,
    });
  }
}

module.exports = Candidate;
