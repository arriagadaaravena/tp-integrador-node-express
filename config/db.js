// config/db.js
// Módulo 7 — Conexión a la base de datos (Lección 1).
//
// Se expone un pool de conexiones "crudo" con mysql2/promise, que se usa
// para las operaciones de SQL manual (Lecciones 2, 3 y 4). El acceso vía
// ORM (Sequelize) se configura por separado en models/index.js, para poder
// comparar ambas formas de acceder a los mismos datos (Lección 5).

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
});

// Verifica la conexión apenas arranca el servidor (Requisito mínimo:
// "Log en consola al conectar con éxito").
async function verificarConexion() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a MySQL establecida correctamente (mysql2).');
    connection.release();
  } catch (error) {
    console.error('No se pudo conectar a MySQL:', error.message);
  }
}

module.exports = { pool, verificarConexion };
