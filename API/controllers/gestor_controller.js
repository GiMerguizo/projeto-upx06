const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/gestorModel'); // Alterado para professorModel

const registrar = async (req, res) => {
  const { nome_completo, data_nascimento, email, senha, setor} = req.body; // Adicionado empresa

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const gestorId = await pool.createGestor(nome_completo, data_nascimento, email, hashedPassword, setor);

    const token = jwt.sign({ gestorId }, 'EFB3FCcl'); // Alterado para gestorId

    res.status(201).json({ message: 'gestor registrado com sucesso!', token });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      // Erro de violação de restrição UNIQUE (email ou username já existe)
      if (error.constraint === 'gestores_email_key') {
        res.status(400).json({ message: 'Email já cadastrado' });
      } else if (error.constraint === 'gestores_username_key') {
        res.status(400).json({ message: 'Username já cadastrado' });
      } else {
        res.status(500).json({ message: 'Erro ao registrar gestor' });
      }
    } else {
      res.status(500).json({ message: 'Erro ao registrar gestor' });
    }
  }
};
const listarGestores = async (req, res) => {
  try {
    const gestores = await pool.getAllGestores();
    res.status(200).json(gestores);
  } catch (error) {
    console.error('Erro ao listar gestores:', error);
    res.status(500).json({ message: error.message || 'Erro ao listar gestores' });
  }
};

const excluirGestor = async (req, res) => {
  const gestorId = parseInt(req.params.id, 10);

  try {
    const gestorExcluido = await pool.deleteGestor(gestorId);

    if (gestorExcluido) {
      res.status(200).json({ message: 'Gestor excluído com sucesso!' });
    } else {
      res.status(404).json({ message: 'Gestor não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao excluir gestor:', error);
    res.status(500).json({ message: error.message || 'Erro ao excluir gestor' });
  }
};

const buscarGestorPorId = async (req, res) => {
  const gestorId = parseInt(req.params.id, 10);

  try {
    const gestor = await pool.getGestorById(gestorId);

    if (gestor) {
      res.status(200).json(gestor);
    } else {
      res.status(404).json({ message: 'Gestor não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar gestor:', error);
    res.status(500).json({ message: error.message || 'Erro ao buscar gestor' });
  }
};

const editarGestor = async (req, res) => {
  const gestorId = parseInt(req.params.id, 10);
  const { nome_completo, data_nascimento, email, senha, setor} = req.body;

  try {
    // Hash da senha, se necessário
    const hashedPassword = senha ? await bcrypt.hash(senha, 10) : undefined;
    const senhaAtualizada = hashedPassword || senha;

    const gestorAtualizado = await pool.updateGestor(
      gestorId,
      nome_completo,
      data_nascimento,
      email,
      senhaAtualizada,
      setor
    );

    if (gestorAtualizado) {
      res.status(200).json({ message: 'Gestor atualizado com sucesso!' });
    } else {
      res.status(404).json({ message: 'Gestor não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar gestor:', error);
    res.status(500).json({ message: error.message || 'Erro ao atualizar gestor' });
  }
};

const getPerfilGestor = async (req, res) => {
  const gestorId = req.usuario.gestorId;

  try {
    const gestor = await pool.getGestorById(gestorId);
    if (gestor) {
      res.status(200).json(gestor);
    } else {
      res.status(404).json({ message: 'Gestor não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar perfil do gestor:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil do gestor.' });
  }
};

const getEstagiarios = async (req, res) => {
  const gestorId = req.usuario.gestorId;

  try {
    const estagiarios = await pool.getEstagiariosDoGestor(gestorId);
    console.log('Estagiários:', estagiarios); 
    res.status(200).json(estagiarios);
  } catch (error) {
    console.error('Erro ao buscar estagiários:', error);
    res.status(500).json({ message: 'Erro ao buscar estagiários.' });
  }
};


module.exports = {
  registrar,
  listarGestores,
  excluirGestor,
  buscarGestorPorId,
  editarGestor,
  getEstagiarios,
  getPerfilGestor
};
