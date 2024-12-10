const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool1 = require('../models/estagiarioModel');
const { pool } = require('../models/estagiarioModel');
const gestorModel = require('../models/gestorModel');

const registrar = async (req, res) => {
  const { nome_completo, data_nascimento, email, senha, curso } = req.body;
  const ativo = false
  const tipo_usuario = 'estagiario';

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir o usuário no banco de dados (usando a função do model)
    const userId = await pool1.createEstagiario(nome_completo, data_nascimento, email, hashedPassword, ativo, tipo_usuario, curso);

    const token = jwt.sign({ userId }, 'EFB3FCcl');

    res.status(201).json({ message: 'Estagiario registrado com sucesso!', token }); // Enviar o token na resposta
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      // Erro de violação de restrição UNIQUE (email  já existe)
      if (error.constraint === 'usuarios_email_key') {
        res.status(400).json({ message: 'Email já cadastrado' });
      } else {
        res.status(500).json({ message: 'Erro ao registrar usuário' });
      }
    } else {
      res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
  }
};

const listar_estagiario = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM estagiario'); 
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar estagiarios:', error);
    res.status(500).json({ message: 'Erro ao buscar estagiarios' });
  }
};


const excluirEstagiario = async (req, res) => {
  const estagiarioId = parseInt(req.params.id, 10);

  try {
    const result = await pool.query('DELETE FROM estagiario WHERE id = $1', [estagiarioId]);

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Estagiário excluído com sucesso!' });
    } else {
      res.status(404).json({ message: 'Estagiário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao excluir estagiário:', error);
    res.status(500).json({ message: 'Erro ao excluir estagiário.' });
  }
};


const editarEstagiario = async (req, res) => {
  const estagiarioId = req.params.id;
  const { nome_completo, data_nascimento, email, senha, curso, ativo } = req.body;

  try {
    // Construir a query SQL dinamicamente
    let query = 'UPDATE estagiario SET';
    let params = [];
    let count = 1;

    if (nome_completo) {
      query += ` nome_completo = $${count},`;
      params.push(nome_completo);
      count++;
    }

    if (data_nascimento) {
      query += ` data_nascimento = $${count},`;
      params.push(data_nascimento);
      count++;
    }

    if (email) {
      query += ` email = $${count},`;
      params.push(email);
      count++;
    }

    if (senha) {
      // Criptografar a senha antes de atualizar
      const hashedPassword = await bcrypt.hash(senha, 10); 
      query += ` senha = $${count},`;
      params.push(hashedPassword);
      count++;
    }

    if (curso) {
      query += ` curso = $${count},`;
      params.push(curso);
      count++;
    }

    if (ativo !== undefined) { // Verificar se ativo foi fornecido (pode ser true ou false)
      query += ` ativo = $${count},`;
      params.push(ativo);
      count++;
    }

    // Remover a última vírgula da query
    query = query.slice(0, -1);

    query += ` WHERE id = $${count}`;
    params.push(estagiarioId);

    const result = await pool.query(query, params);

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Estagiário atualizado com sucesso!' });
    } else {
      res.status(404).json({ message: 'Estagiário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar estagiário:', error);
    res.status(500).json({ message: 'Erro ao atualizar estagiário.' });
  }
};

const buscarEstagiarioPorId = async (req, res) => {
  const estagiarioId = parseInt(req.params.id, 10);

  try {
    const result = await pool.query('SELECT * FROM estagiario WHERE id = $1', [estagiarioId]);
    if (result.rows.length === 1) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Estagiário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar estagiário:', error);
    res.status(500).json({ message: 'Erro ao buscar estagiário.' });
  }
};

const desvincularEstagiario = async (req, res) => {
  const estagiarioId = parseInt(req.params.id, 10);
  const usuario = req.usuario; // Dados do usuário logado (empresa ou gestor)

  try {
    const estagiario = await pool1.getEstagiarioById(estagiarioId);

    if (!estagiario) {
      return res.status(404).json({ message: 'Estagiário não encontrado.' });
    }

    // Verificar se o usuário logado tem permissão para desvincular
    if (usuario.tipoUsuario === 'empresa' && estagiario.empresa_id !== usuario.empresaId) {
      return res.status(403).json({ message: 'Você não tem permissão para desvincular este estagiário.' });
    } else if (usuario.tipoUsuario === 'gestor') {
      const estagiariosDoGestor = await gestorModel.getEstagiariosDoGestor(usuario.userId);
      const estagiarioVinculado = estagiariosDoGestor.find(e => e.id === estagiarioId);
      if (!estagiarioVinculado) {
        return res.status(403).json({ message: 'Você não tem permissão para desvincular este estagiário.' });
      }
    }

    // Desvincular o estagiário da empresa (remove a relação na tabela estagiario_gestor)
    await pool.query('DELETE FROM estagiario_gestor WHERE estagiario_id = $1', [estagiarioId]);

    res.status(200).json({ message: 'Estagiário desvinculado com sucesso!' });
  } catch (error) {
    console.error('Erro ao desvincular estagiário:', error);
    res.status(500).json({ message: 'Erro ao desvincular estagiário.' });
  }
};


module.exports = { 
  registrar,
  listar_estagiario,
  excluirEstagiario,
  editarEstagiario,
  buscarEstagiarioPorId,
  desvincularEstagiario
 };