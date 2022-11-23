const Yup = require("yup");

const Vaga = require("../models/Vaga");
const Candidate = require("../models/Candidate");
const VagasCandidates = require("../models/VagaCandidate");

class VagasCandidatesController {
  async list(req, res) {
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

    // Busca os candidatos a essa vaga
    const data = await vaga.getCandidates({
      attributes: {
        exclude: ["userId", "user_id"],
      },
    });

    return res.json(data);
  }

  async create(req, res) {
    const { candidateId, requisites, quizStatus, quizNote, interviewed } =
      req.body;

    // Verifica os dados do corpo da requisição
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

    // Adiciona o registro na tabela de vagas candidatos
    await vaga.addCandidate(candidate, {
      through: {
        requisites,
        quizStatus,
        quizNote,
        interviewed,
      },
    });

    // Busca o registro adicionado na tabela de vagasCandidates
    const vagaCandidate = await VagasCandidates.findOne({
      where: {
        candidateId: candidateId,
        vagaId: req.params.vagaId,
      },
    });

    return res.json(vagaCandidate);
  }

  async update(req, res) {
    // Valida o schema
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

    // Busca o candidato
    const candidate = await Candidate.findOne({
      where: {
        id: req.params.id,
        user_id: req.params.userId,
      },
    });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Verifica se o candidato esta nessa vaga
    const exists = await vaga.hasCandidate(candidate);
    if (!exists) {
      return res.status(401).json({ error: "Candidate is not in this job" });
    }

    // Atualiza os dados
    const { requisites, quizStatus, quizNote, interviewed } = req.body;
    await vaga.addCandidate(candidate, {
      through: {
        requisites,
        quizStatus,
        quizNote,
        interviewed,
      },
    });

    // Busca o registro atualizado
    const [vagaCandidate] = await vaga.getCandidates({
      where: {
        id: req.params.id,
      },
    });

    return res.json(vagaCandidate);
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
