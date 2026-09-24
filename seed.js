// seed.js
// Crea las tablas del proyecto (si no existen) y carga datos de prueba.
// Se ejecuta a mano con: npm run seed
//
// Es seguro volver a ejecutarlo: cada bloque revisa si su tabla ya tiene
// datos antes de insertar, así no se duplica nada.
//
// Módulo 7: tablas usuarios y pedidos.
// Módulo 8: tablas productos, pedido_productos (N:M) y perfiles (1:1).

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./config/db');

async function contar(tabla) {
  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM ${tabla}`);
  return rows[0].total;
}

async function crearTablas() {
  console.log('Creando tablas (si no existen)...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      producto VARCHAR(150) NOT NULL,
      monto DECIMAL(10,2) NOT NULL,
      usuario_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `);

  // Módulo 8
  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      precio DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pedido_productos (
      pedido_id INT NOT NULL,
      producto_id INT NOT NULL,
      cantidad INT NOT NULL DEFAULT 1,
      PRIMARY KEY (pedido_id, producto_id),
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
      FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS perfiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL UNIQUE,
      foto VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `);
}

async function cargarUsuariosYPedidos() {
  if ((await contar('usuarios')) > 0) {
    console.log('- usuarios: ya tiene datos, se omite.');
    return;
  }

  // Las contraseñas se guardan hasheadas con bcrypt, nunca en texto plano.
  const passwordHash = await bcrypt.hash('123456', 10);
  const usuariosSimulados = [
    { nombre: 'Camila Rojas', email: 'camila.rojas@example.com', producto: 'Teclado mecánico', monto: 45990 },
    { nombre: 'Matías Soto', email: 'matias.soto@example.com', producto: 'Mouse inalámbrico', monto: 15990 },
    { nombre: 'Javiera Muñoz', email: 'javiera.munoz@example.com', producto: 'Monitor 24"', monto: 129990 },
  ];

  for (const u of usuariosSimulados) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [u.nombre, u.email, passwordHash]
    );
    await pool.query(
      'INSERT INTO pedidos (producto, monto, usuario_id) VALUES (?, ?, ?)',
      [u.producto, u.monto, result.insertId]
    );
  }
  console.log('- usuarios y pedidos: 3 de cada uno insertados.');
}

async function cargarProductos() {
  if ((await contar('productos')) > 0) {
    console.log('- productos: ya tiene datos, se omite.');
    return;
  }

  const productos = [
    ['Teclado mecánico', 45990],
    ['Mouse inalámbrico', 15990],
    ['Monitor 24"', 129990],
    ['Audífonos', 19990],
  ];
  for (const [nombre, precio] of productos) {
    await pool.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
  }
  console.log('- productos: 4 insertados.');
}

async function cargarPedidoProductos() {
  if ((await contar('pedido_productos')) > 0) {
    console.log('- pedido_productos: ya tiene datos, se omite.');
    return;
  }

  // Asocia el primer pedido que exista con dos productos, para que la
  // relación N:M tenga datos de ejemplo desde el principio.
  const [pedidos] = await pool.query('SELECT id FROM pedidos ORDER BY id ASC LIMIT 1');
  const [productos] = await pool.query('SELECT id FROM productos ORDER BY id ASC LIMIT 2');
  if (pedidos.length === 0 || productos.length < 2) {
    console.log('- pedido_productos: no hay pedidos o productos suficientes, se omite.');
    return;
  }

  await pool.query(
    'INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) VALUES (?, ?, ?), (?, ?, ?)',
    [pedidos[0].id, productos[0].id, 1, pedidos[0].id, productos[1].id, 2]
  );
  console.log(`- pedido_productos: pedido ${pedidos[0].id} asociado a 2 productos.`);
}

async function seed() {
  try {
    await crearTablas();
    await cargarUsuariosYPedidos();
    await cargarProductos();
    await cargarPedidoProductos();
    console.log('Listo: base de datos preparada.');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar el seed:', error.message);
    process.exit(1);
  }
}

seed();
