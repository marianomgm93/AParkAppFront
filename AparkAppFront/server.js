const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Necesario para emular los UUIDs de Spring Boot

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const SECRET_KEY = 'aparkapp_secreto_emulacion_jwt_123';
const expiresIn = '1h';

server.use(middlewares);
server.use(jsonServer.bodyParser);

// 1. Emular Registro (US01)
server.post('/api/auth/register', (req, res) => {
  const { email, password, name, role } = req.body;
  const db = router.db;

  // Validar si el usuario ya existe
  const existingUser = db.get('users').find({ email: email }).value();
  if (existingUser) {
    return res.status(400).json({ message: 'El email ya se encuentra registrado' });
  }

  // Crear el nuevo usuario respetando el modelo de dominio
  const newUser = {
    id: crypto.randomUUID(), // Genera un UUID estándar
    email,
    password,
    name,
    role: role || 'CLIENT' // Por defecto asigna el rol cliente
  };

  // Guardar en db.json
  db.get('users').push(newUser).write();

  // Generar JWT para loguearlo automáticamente tras el registro
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    SECRET_KEY,
    { expiresIn }
  );

  res.status(201).json({ token });
});

// 2. Actualizar Login con validación estricta
server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  
  const user = db.get('users').find({ email: email }).value();

  // Ahora valida estrictamente que la contraseña coincida con el db.json
  if (user && user.password === password) {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      SECRET_KEY, 
      { expiresIn }
    );
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

// 3. Ocultar el password en las respuestas GET a /users
router.render = (req, res) => {
  let data = res.locals.data;
  // Si se consultan usuarios, eliminar el password de la respuesta para emular DTOs
  if (req.originalUrl.includes('/users') && data) {
    if (Array.isArray(data)) {
      data = data.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } else {
      const { password, ...userWithoutPassword } = data;
      data = userWithoutPassword;
    }
  }
  res.json(data);
};

// Interceptor de JWT...
// (Mantén aquí el middleware de validación del token que ya tenías)

// Configuración de JWT simulada

server.use(middlewares);
server.use(jsonServer.bodyParser);

// 1. Emular el endpoint de autenticación (Login)
server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db; // Acceder a la base de datos de db.json
  
  // Buscar el usuario por email
  const user = db.get('users').find({ email: email }).value();

  // Para la emulación, asumiremos que cualquier contraseña es válida (ej. '1234')
  if (user && password) {
    // Generar el token inyectando el id, email y el rol (OWNER, CLIENT, EMPLOYEE, ADMIN)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      SECRET_KEY, 
      { expiresIn }
    );
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

// 2. Middleware para interceptar y validar JWT en rutas protegidas
server.use((req, res, next) => {
  // Permitir endpoints públicos (ej. auth)
  if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
    return next();
  }

  // Verificar que el header Authorization exista y tenga el formato 'Bearer <token>'
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token JWT no proporcionado' });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    // Verificar si el token es válido
    const decodedPayload = jwt.verify(token, SECRET_KEY);
    
    // (Opcional) Puedes inyectar el payload en el request por si lo necesitas en otra ruta
    req.user = decodedPayload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token expirado o inválido' });
  }
});

// Usar el router de json-server para el resto de los endpoints
server.use(router);

server.listen(3000, () => {
  console.log('AParkAPP Mock Server con JWT está corriendo en http://localhost:3000');
});