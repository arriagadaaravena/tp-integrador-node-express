// models/usuario.model.js
// Modelo Sequelize para la tabla "usuarios" (la misma tabla que se usa
// para las consultas SQL manuales de las Lecciones 2, 3 y 4).

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define(
    'Usuario',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'usuarios',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      defaultScope: {
        // Por defecto, nunca traer la contraseña en las consultas del ORM
        // (misma protección de datos sensibles que se aplica en las
        // consultas SQL manuales).
        attributes: { exclude: ['password'] },
      },
    }
  );

  return Usuario;
};
