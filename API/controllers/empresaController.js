const empresaModel = require('../models/empresaModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gestorModel = require('../models/gestorModel'); 
const estagiarioModel = require('../models/estagiarioModel');
const { pool } = require('../models/estagiarioModel'); 

const criarEmpresa = async (req, res) => {
  const { nome, senha, endereco, cnpj } = req.body;

  try {
    // Verificar se a empresa já existe
    const empresaExistente = await empresaModel.getEmpresaByName(nome);
    if (empresaExistente) {
      return res.status(400).json({ message: 'Já existe uma empresa com este nome.' });
    }

    // Criar a empresa
    const empresaId = await empresaModel.createEmpresa(nome, senha, endereco, cnpj);

    res.status(201).json({ message: 'Empresa criada com sucesso!', id: empresaId });
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ message: 'Erro ao criar empresa.' });
  }
};

const listarEmpresas = async (req, res) => {
  try {
    const empresas = await empresaModel.getAllEmpresas();
    res.status(200).json(empresas);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ message: 'Erro ao listar empresas.' });
  }
};

const editarEmpresa = async (req, res) => {
  const empresaId = req.params.id;
  const { nome, senha, endereco, cnpj } = req.body;

  try {
    const empresaAtualizada = await empresaModel.updateEmpresa(empresaId, nome, senha, endereco, cnpj);
    if (empresaAtualizada) {
      res.status(200).json({ message: 'Empresa atualizada com sucesso!' });
    } else {
      res.status(404).json({ message: 'Empresa não encontrada.' });
    }
  } catch (error) {
    console.error('Erro ao editar empresa:', error);
    res.status(500).json({ message: 'Erro ao editar empresa.' });
  }
};

const excluirEmpresa = async (req, res) => {
  const empresaId = req.params.id;

  try {
    const empresaExcluida = await empresaModel.deleteEmpresa(empresaId);
    if (empresaExcluida) {
      res.status(200).json({ message: 'Empresa excluída com sucesso!' });
    } else {
      res.status(404).json({ message: 'Empresa não encontrada.' });
    }
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    res.status(500).json({ message: 'Erro ao excluir empresa.' });
  }
};

const loginEmpresa = async (req, res) => {
  const { nome, senha } = req.body;

  try {
    const empresa = await empresaModel.getEmpresaByName(nome);

    if (!empresa) {
      return res.status(401).json({ message: 'Empresa não encontrada.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, empresa.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ empresaId: empresa.id }, 'EFB3FCcl');
    res.status(200).json({ 
      token,
      tipoUsuario: 'empresa' 
    });
  } catch (error) {
    console.error('Erro no login da empresa:', error);
    res.status(500).json({ message: 'Erro no login da empresa.' });
  }
};


const cadastrarGestor = async (req, res) => {
  const empresaId = req.usuario.empresaId; // ID da empresa logada
  const { nome_completo, data_nascimento, email, senha, setor } = req.body;
  const tipo_usuario = 'gestor';

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cadastrar o gestor com o ID da empresa
    const gestorId = await gestorModel.createGestor(nome_completo, data_nascimento, email, hashedPassword, setor, tipo_usuario, empresaId); 

    res.status(201).json({ message: 'Gestor cadastrado com sucesso!', id: gestorId });
  } catch (error) {
    console.error('Erro ao cadastrar gestor:', error);
    res.status(500).json({ message: 'Erro ao cadastrar gestor.' });
  }
};



const atribuirEstagiario = async (req, res) => {
  const empresaId = req.usuario.empresaId; // ID da empresa logada
  const { id_estagiario, id_gestor } = req.body;

  try {
    // Verificar se o gestor pertence à empresa
    const gestor = await gestorModel.getGestorById(id_gestor);

    if (!gestor || gestor.empresa_id !== empresaId) {
      return res.status(400).json({ message: 'Gestor inválido.' });
    }

    // Buscar o estagiário
    const estagiario = await estagiarioModel.getEstagiarioById(id_estagiario);

    if (!estagiario) {
      return res.status(400).json({ message: 'Estagiário inválido.' });
    }

    // Atribuir o estagiário ao gestor e à empresa
    await pool.query('INSERT INTO estagiario_gestor (estagiario_id, gestor_id) VALUES ($1, $2)', [id_estagiario, id_gestor]);
    await pool.query('UPDATE estagiario SET empresa_id = $1 WHERE id = $2', [empresaId, id_estagiario]); // Atualiza a empresa do estagiário

    res.status(200).json({ message: 'Estagiário atribuído ao gestor com sucesso!' });
  } catch (error) {
    console.error('Erro ao atribuir estagiário:', error);
    res.status(500).json({ message: 'Erro ao atribuir estagiário.' });
  }
};


module.exports = {
  criarEmpresa,
  listarEmpresas,
  editarEmpresa,
  excluirEmpresa,
  loginEmpresa,
  cadastrarGestor,
  atribuirEstagiario,
};