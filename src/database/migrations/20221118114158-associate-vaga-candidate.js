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
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          primaryKey: true,
        },

        candidate_id: {
          type: Sequelize.INTEGER,
          references: { model: "candidates", key: "id" },
          allowNull: false,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          primaryKey: true,
        },

        quiz_status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "Pendente",
        },

        quiz_note: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },

        requisites: {
          type: Sequelize.JSONB,
          allowNull: true,
        },

        interviewed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
