// Configurar a conexão com o PostgreSQL
const pg = require('pg');

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'upx06',
    password: 'EFB3FCcl',
    port: 5432,
  });

const createEstagiario = async (nome_completo, data_nascimento, email, senha, username, ativo) => {
    const result = await pool.query(
      'INSERT INTO estagiario (nome_completo, data_nascimento, email, senha, username, ativo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [nome_completo, data_nascimento, email, senha, username, ativo]
    );
    return result.rows[0].id;
  };
  
  const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM estagiario WHERE email = $1', [email]);
    return result.rows[0];
  };
  
  const updateUserStatus = async (email, ativo) => {
    await pool.query('UPDATE estagiario SET ativo = $1 WHERE email = $2', [ativo, email]);
};

  const updateUserPassword = async (email, senha) => {
    await pool.query('UPDATE estagiario SET senha = $1 WHERE email = $2', [senha, email]);
  };
  
  module.exports = {
    createEstagiario,
    getUserByEmail,
    updateUserPassword,
    pool, 
  };