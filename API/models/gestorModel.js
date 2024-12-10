const pg = require('pg');

// Configurar a conexão com o PostgreSQL (substitua pelas suas informações)
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'upx06',
    password: 'EFB3FCcl',
    port: 5432,
  });

const createGestor = async (nome_completo, data_nascimento, email, senha, setor, tipo_usuario, empresa_id ) => { 
  const result = await pool.query(
    'INSERT INTO gestor (nome_completo, data_nascimento, email, senha, setor, tipo_usuario, empresa_id ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', 
    [nome_completo, data_nascimento, email, senha, setor,  tipo_usuario, empresa_id ] 
  );
  return result.rows[0].id;
};

const getGestorByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM gestor WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao buscar gestor por email:', error);
    throw new Error('Erro ao buscar gestor no banco de dados.');
  }
};

const updateGestor = async (id, nome_completo, data_nascimento, email, senha, setor) => {
  try {
    const result = await pool.query(
      'UPDATE gestor SET nome_completo = $1, data_nascimento = $2, email = $3, senha = $4, setor = $5 WHERE id = $6',
      [nome_completo, data_nascimento, email, senha, setor, id]
    );
    return result.rowCount === 1;
  } catch (error) {
    console.error('Erro ao atualizar gestor:', error);
    throw new Error('Erro ao atualizar gestor no banco de dados.');
  }
};

const deleteGestor = async (id) => {
  try {
    const result = await pool.query('DELETE FROM gestor WHERE id = $1', [id]);
    return result.rowCount === 1;
  } catch (error) {
    console.error('Erro ao excluir gestor:', error);
    throw new Error('Erro ao excluir gestor no banco de dados.');
  }
};

const getAllGestores = async () => {
  try {
    const result = await pool.query('SELECT * FROM gestor');
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar gestores:', error);
    throw new Error('Erro ao buscar gestores no banco de dados.');
  }
};

const getGestorById = async (id) => {
  try {
    const result = await pool.query(`
      SELECT g.*, e.nome AS nome_empresa 
      FROM gestor g
      JOIN empresa e ON g.empresa_id = e.id
      WHERE g.id = $1
    `, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao buscar gestor por ID:', error);
    throw new Error('Erro ao buscar gestor no banco de dados.');
  }
};


const getEstagiariosDoGestor = async (gestorId) => {
  try {
    const result = await pool.query(`
      SELECT e.*
      FROM estagiario e
      JOIN estagiario_gestor eg ON e.id = eg.estagiario_id
      JOIN gestor g ON eg.gestor_id = g.id
      WHERE eg.gestor_id = $1 AND e.empresa_id = g.empresa_id
    `, [gestorId]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar estagiários do gestor:', error);
    throw new Error('Erro ao buscar estagiários do gestor no banco de dados.');
  }
};


module.exports = {
  createGestor, 
  getGestorByEmail, 
  updateGestor,
  deleteGestor,
  getAllGestores,
  getGestorById,
  getEstagiariosDoGestor,
  pool,
};