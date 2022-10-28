const { Op } = require("sequelize");
const Yup = require("yup");

const Vaga = require("../models/Vaga");

class VagasController {
  async list(req, res) {
    const { title, description, requisites } = req.query;

    let where = { userId: req.params.userId };

    if (title) {
      where = {
        ...where,
        title: {
          [Op.iLike]: title,
        },
      };
    }

    if (description) {
      where = {
        ...where,
        description: {
          [Op.iLike]: description,
        },
      };
    }

    if (requisites) {
      where = {
        ...where,
        requisites: {
          paciente: { [Op.between]: [-1, 1] },
          sociavel: { [Op.between]: [-1, 1] },
          vigilante: { [Op.between]: [-1, 1] },
          independente: { [Op.between]: [-1, 1] },
        },
      };
    }

    const data = await Vaga.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "user_id", "userId"] },
      where,
    });

    return res.json(data);
  }

  async show(req, res) {
    const vaga = await Vaga.findOne({
      where: {
        userId: req.params.userId,
        id: req.params.id,
      },
      attributes: { exclude: ["user_id", "userId", "createdAt", "updatedAt"] },
    });

    if (!vaga) {
      return res.status(404).json();
    }

    return res.json(vaga);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required().min(20),
      requisites: Yup.object().shape({
        paciente: Yup.number().min(-1).max(1),
        sociavel: Yup.number().min(-1).max(1),
        vigilante: Yup.number().min(-1).max(1),
        independente: Yup.number().min(-1).max(1),
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Erro ao validar o schema." });
    }

    const { id, title, description, requisites } = await Vaga.create({
      ...req.body,
      userId: req.params.userId,
    });

    return res.status(201).json({ id, title, description, requisites });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required().min(20),
      requisites: Yup.object().shape({
        paciente: Yup.number().min(-1).max(1),
        sociavel: Yup.number().min(-1).max(1),
        vigilante: Yup.number().min(-1).max(1),
        independente: Yup.number().min(-1).max(1),
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    const vaga = await Vaga.findOne({
      where: {
        user_id: req.params.userId,
        id: req.params.id,
      },
      attributes: { exclude: ["user_id", "userId", "createdAt", "updatedAt"] },
    });

    if (!vaga) {
      return res.status(404).json();
    }

    await vaga.update(req.body);

    return res.json(vaga);
  }

  async delete(req, res) {
    const vaga = await Vaga.findOne({
      where: {
        user_id: req.params.userId,
        id: req.params.id,
      },
    });

    if (!vaga) {
      return res.status(404).json();
    }

    await vaga.destroy();

    return res.json();
  }
}

module.exports = new VagasController();
