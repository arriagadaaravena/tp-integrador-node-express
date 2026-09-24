// models/perfil.model.js
// Módulo 8 — Relación 1:1 con Usuario: cada usuario tiene (como máximo)
// un perfil, donde se guarda la ruta de su foto subida con POST /upload.

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Perfil = sequelize.define(
    'Perfil',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // el UNIQUE es lo que asegura que la relación sea 1:1
        field: 'usuario_id',
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'perfiles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Perfil;
};
