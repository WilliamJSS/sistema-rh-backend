const { Op } = require("sequelize");

const User = require("../models/User");

class UsersController {
  async list(req, res) {
    const { name, email } = req.query;

    let where = {};

    if (name) {
      where = {
        ...where,
        name: {
          [Op.iLike]: name,
        },
      };
    }

    if (email) {
      where = {
        ...where,
        email: {
          [Op.iLike]: email,
        },
      };
    }

    const data = await User.findAll({
      attributes: { exclude: ["password"] },
      where,
    });

    return res.json(data);
  }

  // async show(req, res) {}

  // async create(req, res) {}

  // async update(req, res) {}

  // async delete(req, res) {}
}

module.exports = new UsersController();
