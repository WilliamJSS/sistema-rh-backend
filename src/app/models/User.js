const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
      },
      {
        sequelize,
        underscored: true,
        name: {
          singular: "user",
          plural: "users",
        },
        schema: "sistema_rh",
      }
    );
  }
}

module.exports = User;
