const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Não autorizado, token inválido' });
    }
  } else {
    res.status(401).json({ message: 'Não autorizado, nenhum token' });
  }
};

module.exports = protect;
