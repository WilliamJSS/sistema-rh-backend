require("dotenv-safe").config();

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      "vagas",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        requisites: {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: {
            independente: 0,
            sociavel: 0,
            paciente: 0,
            vigilante: 0,
          },
        },

        user_id: {
          type: Sequelize.INTEGER,
          references: { model: "users", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          allowNull: false,
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
    queryInterface.dropTable("vagas", { schema: process.env.DB_SCHEMA }),
};
