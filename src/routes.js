const routes = require("express").Router();

const users = require("./app/controllers/UsersController");

routes.get("/users", users.list);
routes.get("/users/:id", users.show);
routes.post("/users", users.create);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.delete);

module.exports = routes;
