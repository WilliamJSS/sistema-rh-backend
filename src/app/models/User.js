const Sequelize = require("sequelize");
const { Model } = require("sequelize");

const bcrypt = require("bcryptjs");

require("dotenv-safe").config();

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
        underscored: true,
        name: {
          singular: "user",
          plural: "users",
        },
        schema: process.env.DB_SCHEMA,
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    this.hasMany(models.Vaga);
    this.hasMany(models.Candidate);
  }
}

module.exports = User;
