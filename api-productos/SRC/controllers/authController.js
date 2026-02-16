const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        // Validar si el usuario ya existe
        const userExists = await User.findOne({ username: req.body.username });
        if (userExists) return res.status(400).json({ error: 'Usuario ya existe' });

        // Hashear password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            username: req.body.username,
            password: password
        });
        
        const savedUser = await user.save();
        res.json({ error: null, data: savedUser._id });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.login = async (req, res) => {
    // Validar usuario
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    // Validar password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Contraseña no válida' });

    // Crear token
    const token = jwt.sign({
        name: user.username,
        id: user._id
    }, process.env.JWT_SECRET);

    res.header('auth-token', token).json({
        error: null,
        data: { token }
    });
};