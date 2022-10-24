module.exports = {
  up: (Sequelize) => Sequelize.createSchema("sistema_rh"),

  down: (Sequelize) => Sequelize.dropSchema("sistema_rh"),
};
