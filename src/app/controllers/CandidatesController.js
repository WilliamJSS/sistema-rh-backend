const { Op } = require("sequelize");
const Yup = require("yup");
const { parseISO } = require("date-fns");

const Candidate = require("../models/Candidate");
const Vaga = require("../models/Vaga");

class CandidatesController {
  async list(req, res) {
    const {
      name,
      email,
      phone,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
    } = req.query;

    let where = { userId: req.params.userId };

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

    if (phone) {
      where = {
        ...where,
        phone: {
          [Op.iLike]: phone,
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

    const data = await Candidate.findAll({
      attributes: { exclude: ["user_id", "userId"] },
      where,
      include: [
        {
          model: Vaga,
          attributes: ["id", "title"],
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
    const candidate = await Candidate.findOne({
      attributes: { exclude: ["user_id", "userId"] },
      where: {
        userId: req.params.userId,
        id: req.params.id,
      },
      include: [
        {
          model: Vaga,
          attributes: ["id", "title"],
          order: [["createdAt", "DESC"]],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!candidate) {
      return res.status(404).json();
    }

    return res.json(candidate);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      phone: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Erro ao validar o schema." });
    }

    const candidate = await Candidate.create({
      ...req.body,
      userId: req.params.userId,
    });

    return res.status(201).json(candidate);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      phone: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    const candidate = await Candidate.findOne({
      where: {
        user_id: req.params.userId,
        id: req.params.id,
      },
      include: [
        {
          model: Vaga,
          attributes: ["id", "title"],
          order: [["createdAt", "DESC"]],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: { exclude: ["user_id", "userId"] },
    });

    if (!candidate) {
      return res.status(404).json();
    }

    await candidate.update(req.body);

    return res.json(candidate);
  }

  async delete(req, res) {
    const candidate = await Candidate.findOne({
      where: {
        user_id: req.params.userId,
        id: req.params.id,
      },
    });

    if (!candidate) {
      return res.status(404).json();
    }

    await candidate.destroy();

    return res.json();
  }
}

module.exports = new CandidatesController();
