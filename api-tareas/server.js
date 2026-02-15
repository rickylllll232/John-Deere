const express = require('express');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'clave_secreta';

app.use(express.json());

async function obtenerTareas() {
  try {
    const data = await fs.readFile('tareas.json', 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
}

async function guardarTareas(tareas) {
  await fs.writeFile('tareas.json', JSON.stringify(tareas, null, 2));
}

async function obtenerUsuarios() {
  try {
    const data = await fs.readFile('usuarios.json', 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
}

async function guardarUsuarios(usuarios) {
  await fs.writeFile('usuarios.json', JSON.stringify(usuarios, null, 2));
}

function autenticarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido' });

    req.user = user;
    next();
  });
}

app.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ mensaje: 'Datos incompletos' });

    const usuarios = await obtenerUsuarios();

    const existe = usuarios.find(u => u.username === username);
    if (existe)
      return res.status(400).json({ mensaje: 'Usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = { id: Date.now(), username, password: hashedPassword };
    usuarios.push(nuevoUsuario);

    await guardarUsuarios(usuarios);

    res.status(201).json({ mensaje: 'Usuario registrado' });

  } catch (error) {
    next(error);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const usuarios = await obtenerUsuarios();
    const usuario = usuarios.find(u => u.username === username);

    if (!usuario)
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido)
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, username: usuario.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    next(error);
  }
});

app.get('/tareas', autenticarToken, async (req, res, next) => {
  try {
    const tareas = await obtenerTareas();
    res.json(tareas);
  } catch (error) {
    next(error);
  }
});

app.post('/tareas', autenticarToken, async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion)
      return res.status(400).json({ mensaje: 'Datos incompletos' });

    const tareas = await obtenerTareas();

    const nuevaTarea = {
      id: Date.now(),
      titulo,
      descripcion
    };

    tareas.push(nuevaTarea);
    await guardarTareas(tareas);

    res.status(201).json(nuevaTarea);

  } catch (error) {
    next(error);
  }
});

app.put('/tareas/:id', autenticarToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    const tareas = await obtenerTareas();
    const tarea = tareas.find(t => t.id == id);

    if (!tarea)
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    tarea.titulo = titulo || tarea.titulo;
    tarea.descripcion = descripcion || tarea.descripcion;

    await guardarTareas(tareas);

    res.json(tarea);

  } catch (error) {
    next(error);
  }
});

app.delete('/tareas/:id', autenticarToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    let tareas = await obtenerTareas();
    const nuevasTareas = tareas.filter(t => t.id != id);

    if (tareas.length === nuevasTareas.length)
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    await guardarTareas(nuevasTareas);

    res.json({ mensaje: 'Tarea eliminada' });

  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error en el servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
