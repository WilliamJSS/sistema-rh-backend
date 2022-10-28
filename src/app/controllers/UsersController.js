const { Op } = require("sequelize");
const Yup = require("yup");

const User = require("../models/User");
const Vaga = require("../models/Vaga");

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
      attributes: {
        exclude: ["password", "password_hash", "createdAt", "updatedAt"],
      },
      where,
      include: [
        {
          model: Vaga,
          attributes: ["id", "title"],
        },
      ],
    });

    return res.json(data);
  }

  async show(req, res) {
    const user = await User.findOne({
      attributes: {
        exclude: ["password", "password_hash", "createdAt", "updatedAt"],
      },
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Vaga,
          attributes: ["id", "title"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json();
    }

    return res.json(user);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Erro ao validar o schema." });
    }

    const { id, name, email } = await User.create(req.body);

    return res.status(201).json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Erro ao validar o schema." });
    }

    // Busca o usuario
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    // Verifica se a senha digitida é igual a senha atual
    const { oldPassword } = req.body;

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ erro: "Senha antiga incorreta." });
    }

    // Atualiza os dados do usuario
    const { id, name, email } = await user.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    await user.destroy();

    return res.json();
  }
}

module.exports = new UsersController();
