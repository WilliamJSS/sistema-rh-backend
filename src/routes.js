const routes = require("express").Router();

const users = require("./app/controllers/UsersController");

routes.get("/users", users.list);

module.exports = routes;
