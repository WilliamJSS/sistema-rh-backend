require("dotenv-safe").config();

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn(
      "vagas",
      "open",
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      { schema: process.env.DB_SCHEMA }
    ),

  down: (queryInterface) =>
    queryInterface.removeColumn("vagas", "open", {
      schema: process.env.DB_SCHEMA,
    }),
};
