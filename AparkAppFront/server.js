const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configuración de JWT simulada
const SECRET_KEY = 'aparkapp_secreto_emulacion_jwt_123';
const expiresIn = '1h';

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