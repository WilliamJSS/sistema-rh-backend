const { Op } = require("sequelize");
const Yup = require("yup");
const { parseISO } = require("date-fns");

const Vaga = require("../models/Vaga");
const Candidate = require("../models/Candidate");

class VagasController {
  async list(req, res) {
    const {
      title,
      description,
      open,
      requisites,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
    } = req.query;

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

    if (open) {
      where = {
        ...where,
        open: {
          [Op.iLike]: open,
        },
      };
    }

    if (requisites) {
      where = {
        ...where,
        requisites: {
          paciente: { [Op.between]: [0, 4] },
          sociavel: { [Op.between]: [0, 4] },
          vigilante: { [Op.between]: [0, 4] },
          independente: { [Op.between]: [0, 4] },
        },
      };
    }

    if (createdBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.lte]: parseISO(createdBefore),
        },
      };
    }

    if (createdAfter) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(createdAfter),
        },
      };
    }

    if (updatedBefore) {
      where = {
        ...where,
        updatedAt: {
          [Op.lte]: parseISO(updatedBefore),
        },
      };
    }

    if (updatedAfter) {
      where = {
        ...where,
        updatedAt: {
          [Op.gte]: parseISO(updatedAfter),
        },
      };
    }

    const data = await Vaga.findAll({
      attributes: { exclude: ["user_id", "userId"] },
      where,
      include: [
        {
          model: Candidate,
          attributes: ["id", "name"],
          order: [["createdAt", "DESC"]],
          through: {
            attributes: [],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(data);
  }

  async show(req, res) {
    const vaga = await Vaga.findOne({
      where: {
        userId: req.params.userId,
        id: req.params.id,
      },
      include: [
        {
          model: Candidate,
          attributes: ["id", "name"],
          order: [["createdAt", "DESC"]],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: { exclude: ["user_id", "userId"] },
    });

    if (!vaga) {
      return res.status(404).json();
    }

    return res.json(vaga);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      requisites: Yup.object().shape({
        independente: Yup.number().min(0).max(4),
        sociavel: Yup.number().min(0).max(4),
        paciente: Yup.number().min(0).max(4),
        vigilante: Yup.number().min(0).max(4),
      }),
      open: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Erro ao validar o schema." });
    }

    const vaga = await Vaga.create({
      ...req.body,
      userId: req.params.userId,
    });

    return res.status(201).json(vaga);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      requisites: Yup.object().shape({
        paciente: Yup.number().min(0).max(4),
        sociavel: Yup.number().min(0).max(4),
        vigilante: Yup.number().min(0).max(4),
        independente: Yup.number().min(0).max(4),
      }),
      open: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    const vaga = await Vaga.findOne({
      where: {
        user_id: req.params.userId,
        id: req.params.id,
      },
      include: [
        {
          model: Candidate,
          attributes: ["id", "name"],
          order: [["createdAt", "DESC"]],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: { exclude: ["user_id", "userId"] },
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
