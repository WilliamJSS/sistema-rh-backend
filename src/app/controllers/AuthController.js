const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authConfig = require("../../config/auth");

class AuthController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ erro: "Senha inválida." });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new AuthController();
