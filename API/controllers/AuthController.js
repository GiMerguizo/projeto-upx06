const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/estagiarioModel').pool; 
const gestorModel = require('../models/gestorModel');

const loginEstagiario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await pool.query('SELECT * FROM estagiario WHERE email = $1', [email]);

    if (usuario.rows.length === 0) {
      return res.status(401).json({ message: 'Estagiário não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.rows[0].senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ userId: usuario.rows[0].id, tipoUsuario: 'estagiario' }, 'EFB3FCcl');
    res.status(200).json({ token, tipoUsuario: 'estagiario' });
  } catch (error) {
    console.error('Erro no login do estagiário:', error);
    res.status(500).json({ message: 'Erro no login.' });
  }
};

const loginGestor = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const gestor = await gestorModel.getGestorByEmail(email);

    if (!gestor) {
      return res.status(401).json({ message: 'Gestor não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, gestor.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ gestorId: gestor.id, tipoUsuario: 'gestor' }, 'EFB3FCcl');
    res.status(200).json({ token, tipoUsuario: 'gestor' });
  } catch (error) {
    console.error('Erro no login do gestor:', error);
    res.status(500).json({ message: 'Erro no login.' });
  }
};

module.exports = {
  loginEstagiario,
  loginGestor
};