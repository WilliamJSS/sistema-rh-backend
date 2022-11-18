require("dotenv-safe").config();

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      "vagas_candidates",
      {
        vaga_id: {
          type: Sequelize.INTEGER,
          references: { model: "vagas", key: "id" },
          allowNull: false,
          primaryKey: true,
        },

        candidate_id: {
          type: Sequelize.INTEGER,
          references: { model: "candidates", key: "id" },
          allowNull: false,
          primaryKey: true,
        },

        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },

      { schema: process.env.DB_SCHEMA }
    ),

  down: (queryInterface) =>
    queryInterface.dropTable("vagas_candidates", {
      schema: process.env.DB_SCHEMA,
    }),
};
