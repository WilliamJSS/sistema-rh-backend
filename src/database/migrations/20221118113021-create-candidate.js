require("dotenv-safe").config();

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      "candidates",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        phone: {
          type: Sequelize.STRING,
          allowNull: false,
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
    queryInterface.dropTable("candidates", { schema: process.env.DB_SCHEMA }),
};
