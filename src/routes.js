const routes = require("express").Router();

const authMiddleware = require("./app/middlewares/auth");
const auth = require("./app/controllers/AuthController");
const users = require("./app/controllers/UsersController");
const vagas = require("./app/controllers/VagasController");
const candidates = require("./app/controllers/CandidatesController");

// Auth
routes.post("/auth", auth.create);

// Usuarios
routes.post("/users", users.create);

routes.use(authMiddleware); // Controla o acesso a partir desse ponto

routes.get("/users", users.list);
routes.get("/users/:id", users.show);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.delete);

// Vagas
routes.get("/users/:userId/vagas", vagas.list);
routes.get("/users/:userId/vagas/:id", vagas.show);
routes.post("/users/:userId/vagas", vagas.create);
routes.put("/users/:userId/vagas/:id", vagas.update);
routes.delete("/users/:userId/vagas/:id", vagas.delete);

routes.post("/users/:userId/vagas/:id", vagas.addCandidate);

// Candidates
routes.get("/users/:userId/candidates", candidates.list);
routes.get("/users/:userId/candidates/:id", candidates.show);
routes.post("/users/:userId/candidates", candidates.create);
routes.put("/users/:userId/candidates/:id", candidates.update);
routes.delete("/users/:userId/candidates/:id", candidates.delete);

module.exports = routes;
