const jwt = require('jsonwebtoken');

const verificarUsuario = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, 'EFB3FCcl'); 


    if (decoded.gestorId || decoded.empresaId) { 
      req.usuario = decoded; 
      next();
    } else {
      return res.status(403).json({ message: 'Acesso negado. Apenas gestores e empresas podem acessar esta rota.' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = verificarUsuario;