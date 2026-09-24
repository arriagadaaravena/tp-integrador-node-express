// seed.js
// Módulo 7 — Crea las tablas "usuarios" y "pedidos" (si no existen) y
// las llena con al menos 3 registros simulados (Requisito mínimo de la
// Lección 2). Se ejecuta a mano, una sola vez, con: npm run seed

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./config/db');

async function seed() {
  try {
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

    const [existentes] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
    if (existentes[0].total > 0) {
      console.log('Ya existen usuarios en la base de datos, no se insertan datos de prueba.');
      process.exit(0);
    }

    console.log('Insertando usuarios y pedidos simulados...');

    // Las contraseñas se guardan hasheadas con bcrypt, nunca en texto
    // plano, aunque en este módulo todavía no se use la contraseña para
    // autenticar (eso llega con JWT en el Módulo 8).
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

    console.log('Listo: 3 usuarios y 3 pedidos de prueba insertados.');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar el seed:', error.message);
    process.exit(1);
  }
}

seed();
