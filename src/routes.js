const routes = require("express").Router();

routes.get("/home", (req, res) => {
    res.json({ msg: "Hello World" });
});

module.exports = routes;
