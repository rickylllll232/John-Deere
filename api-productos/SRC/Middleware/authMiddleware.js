const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Leer el token del header
    const token = req.header('auth-token'); 
    
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // Continuar a la siguiente función
    } catch (error) {
        res.status(400).json({ error: 'Token no es válido' });
    }
};