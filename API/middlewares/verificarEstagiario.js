const jwt = require('jsonwebtoken');

const verificarAprendiz = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, 'EFB3FCcl'); // Substitua 'EFB3FCcl' pela sua chave secreta real

    // Verificar se o usuário é um aprendiz
    if (decoded.userId) { 
      req.usuario = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Acesso negado. Apenas aprendizes podem acessar esta rota.' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = verificarAprendiz;