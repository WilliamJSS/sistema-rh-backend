const { Op } = require("sequelize");
const Yup = require("yup");
const { parseISO } = require("date-fns");

const Vaga = require("../models/Vaga");
const Candidate = require("../models/Candidate");
const VagasCandidates = require("../models/VagaCandidate");

class VagasCandidatesController {
  async list(req, res) {
    const {
      quizStatus,
      quizNote,
      requisites,
      interviewed,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
    } = req.query;

    let where = { vagaId: req.params.vagaId };

    if (quizStatus) {
      where = {
        ...where,
        quizStatus: {
          [Op.iLike]: quizStatus,
        },
      };
    }

    if (quizNote) {
      where = {
        ...where,
        quizNote: {
          [Op.iLike]: quizNote,
        },
      };
    }

    if (interviewed) {
      where = {
        ...where,
        interviewed: {
          [Op.iLike]: interviewed,
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

    const data = await VagasCandidates.findAll({
      attributes: {
        exclude: ["vaga_id", "vagaId"],
      },
      where,
    });

    return res.json(data);
  }

  async create(req, res) {
    const { candidateId } = req.body;

    const schema = Yup.object().shape({
      candidateId: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    // Busca o candidato
    const candidate = await Candidate.findOne({
      where: {
        id: candidateId,
        user_id: req.params.userId,
      },
    });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Busca a vaga
    const vaga = await Vaga.findOne({
      attributes: { exclude: ["user_id", "userId"] },
      where: {
        user_id: req.params.userId,
        id: req.params.vagaId,
      },
    });
    if (!vaga) {
      return res.status(404).json({ error: "Vaga not found" });
    }

    await vaga.addCandidate(candidate, { through: VagasCandidates });

    // Busca o registro adicionado na tabela de vagasCandidates
    const vagaCandidate = await VagasCandidates.findOne({
      where: {
        candidateId: candidateId,
      },
    });

    return res.json(vagaCandidate);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      quizStatus: Yup.string(),
      quizNote: Yup.number(),
      requisites: Yup.object().shape({
        paciente: Yup.number().min(0).max(4),
        sociavel: Yup.number().min(0).max(4),
        vigilante: Yup.number().min(0).max(4),
        independente: Yup.number().min(0).max(4),
      }),
      interviewed: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    const data = await VagasCandidates.findOne({
      attributes: {
        exclude: ["vaga_id", "vagaId"],
      },
      where: {
        vaga_id: req.params.vagaId,
        candidate_id: req.params.id,
      },
    });

    // const data = await Vaga.findOne({
    //   where: {
    //     user_id: req.params.userId,
    //     id: req.params.vagaId,
    //   },
    //   include: [
    //     {
    //       model: Candidate,
    //       attributes: ["id", "name"],
    //       order: [["createdAt", "DESC"]],
    //       through: {
    //         as: "vagas",
    //       },
    //       where: {
    //         id: req.params.id,
    //       },
    //     },
    //   ],
    //   attributes: { exclude: ["user_id", "userId"] },
    // });

    if (!data) {
      return res.status(404).json();
    }

    await data.update(req.params);
    // await data.save();

    return res.json(data);
  }

  async delete(req, res) {
    const vagaCandidate = await VagasCandidates.findOne({
      where: {
        vagaId: req.params.vagaId,
        candidateId: req.params.id,
      },
    });

    if (!vagaCandidate) {
      return res.status(404).json();
    }

    await vagaCandidate.destroy();

    return res.json();
  }
}

module.exports = new VagasCandidatesController();
