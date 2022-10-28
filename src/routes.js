const routes = require("express").Router();

const users = require("./app/controllers/UsersController");
const vagas = require("./app/controllers/VagasController");

// Usuarios
routes.get("/users", users.list);
routes.get("/users/:id", users.show);
routes.post("/users", users.create);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.delete);

// Vagas
routes.get("/users/:userId/vagas", vagas.list);
routes.get("/users/:userId/vagas/:id", vagas.show);
routes.post("/users/:userId/vagas", vagas.create);
routes.put("/users/:userId/vagas/:id", vagas.update);
routes.delete("/users/:userId/vagas/:id", vagas.delete);

module.exports = routes;
